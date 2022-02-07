import 'dotenv/config'
import express from 'express'
import {
  AuthApiClient,
  ChannelInfo,
  KnownChatType,
  Long,
  OpenChannelUserInfo,
  OpenChannelUserPerm,
  TalkOpenChannel,
} from 'node-kakao'
import { BLOCK_CHAT, CHANNEL_DISPLAY_NAME } from './common'
import CLIENT from './module/client'
import messageHidden from './module/message-hidden'
import profileChanged from './module/profile-changed'

interface AttachmentType {
  [key: string]: string | Long | number
  src_logId?: Long
}

CLIENT.on('message_hidden', messageHidden)
CLIENT.on('profile_changed', profileChanged)
CLIENT.on('chat', async (data, channel: TalkOpenChannel) => {
  try {
    const channelDisplayName = channel.getDisplayName()

    if (channelDisplayName === '널디모임Nerdy Turtle NFT') {
      console.log('널디모임 이라능~~~')
    }

    if (CHANNEL_DISPLAY_NAME.includes(channelDisplayName)) {
      console.log({
        channelName: channelDisplayName,
        data,
        attachment: JSON.stringify(data.attachment()),
      })
      const sender = data.getSenderInfo<ChannelInfo, OpenChannelUserInfo>(channel)
      if (!sender) return

      /** 방장, 부방장 권한일 경우 호출 합니다. */
      if (
        sender.perm === OpenChannelUserPerm.MANAGER ||
        sender.perm === OpenChannelUserPerm.OWNER ||
        sender.perm === OpenChannelUserPerm.BOT
      ) {
        if (data.originalType === KnownChatType.REPLY && data.text === '!readers') {
          const reply = data.attachment<AttachmentType>()
          const logId = reply.src_logId
          if (logId) {
            const readers = channel.getReaders({ logId })
            channel.sendChat(
              `${logId} Readers (${readers.length})\n${readers
                .map((reader) => reader.nickname)
                .join(', ')}`
            )
          }
        }

        // if (data.text === "!close") {
        //     channel.sendChat(`터틀 봇은 잠시 쉬러 갈게요. 🥱`);
        //     CLIENT.close();
        // }
      } /** 방장, 부방장, 봇 권한이 아닐경우 호출합니다. */ else {
        /** 욕설 차단 */
        const findIndex = BLOCK_CHAT.findIndex((block) =>
          data.text.toLowerCase().replace(/ /g, '').includes(block)
        )
        if (findIndex !== -1) {
          // (channel as unknown as TalkOpenChannel).hideChat()
          setTimeout(() => channel.hideChat(data.chat), 1000)
          channel.sendChat(`${sender.nickname}님 사용하신 단어는 조심해주세요. 🤫`)
        }

        /** URL 차단 */
        if (data.chat.attachment?.urls?.length > 0) {
          // (channel as unknown as TalkOpenChannel).hideChat()
          setTimeout(() => channel.hideChat(data.chat), 1000)
          channel.sendChat(`${sender.nickname}님 URL은 금지에요. 🚫`)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
})

const app = express()

app.listen(3000, async () => {
  try {
    const form = {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
      // This option force login even other devices are logon
      forced: true,
    }

    const api = await AuthApiClient.create(process.env.DEVICE_NAME, process.env.DEVICE_UUID)

    const loginRes = await api.login(form, true)
    if (!loginRes.success) throw new Error(`Web login failed with status: ${loginRes.status}`)

    const res = await CLIENT.login(loginRes.result)
    if (!res.success) throw new Error(`Login failed with status: ${res.status}`)

    console.log(`Login success!!! 👍`)
  } catch (error) {
    console.error(error)
  }
})
