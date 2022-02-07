import {
  ChannelUserInfo,
  ChatBuilder,
  KnownChatType,
  MentionContent,
  OpenLinkChannelUserInfo,
  TalkChannel,
} from 'node-kakao'
import { CHANNEL_DISPLAY_NAME } from '../common'

const profileChanged = (
  channel: TalkChannel,
  lastInfo: ChannelUserInfo,
  user: OpenLinkChannelUserInfo
) => {
  const channelDisplayName = channel.getDisplayName()
  const builder = new ChatBuilder().text(`${lastInfo.nickname}님이 `)
  builder.append(new MentionContent(user))
  builder.text(' \n으로(로) 변경했습니다.')
  // console.log(builder.build(KnownChatType.TEXT));
  if (CHANNEL_DISPLAY_NAME.includes(channelDisplayName)) {
    channel.sendChat(builder.build(KnownChatType.TEXT))
  }
}

export default profileChanged
