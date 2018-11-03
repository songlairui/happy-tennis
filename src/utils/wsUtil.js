import Nes from './Nes'

const wssDomain = 'ws://localhost:9876'

function genClient(ws) {
  const client = new Nes.Client(`${wssDomain}/h`, { ws })
  return client
}

export default {
  genClient
}
