import { LogSnag } from 'logsnag'

const logsnag = new LogSnag({
  token: process.env.LOGSNAG_API_TOKEN,
  project: 'nextacular',
})

export const log = (
  channel: string,
  event: string,
  description: string,
  icon: string
) =>
  logsnag.publish({
    channel,
    event,
    description,
    icon: icon || '🔥',
    notify: true,
  })
