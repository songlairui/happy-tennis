import Nes from './Nes'

import { baseDomain } from '../api'

const wssDomain = baseDomain.replace(/^http(s?):\/\//, 'ws$1://')
console.info('wssDomain', wssDomain)

function genClient(ws) {
  const client = new Nes.Client(`${wssDomain}`, { ws })
  return client
}

export default {
  genClient
}
