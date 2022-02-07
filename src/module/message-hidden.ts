import { KnownChatType, OpenRewriteFeed, TalkChannel, TypedChatlog } from 'node-kakao'

const messageHidden = (
  feedChatlog: Readonly<TypedChatlog<KnownChatType.FEED>>,
  channel: TalkChannel,
  _feed: OpenRewriteFeed
) => {
  console.log(
    `Message ${feedChatlog.logId} hid from ${channel.channelId} by ${feedChatlog.sender.userId}`
  )
}

export default messageHidden
