import IOST from 'iost'
import Common from '../server/common'

export default function ({ app, store, req, $axios }, inject) {
  const httpProvider = new IOST.HTTPProvider(process.env.NODE_ENV === 'development' ? 'https://www.iostabc.com/endpoint' : process.SERVER_BUILD?'https://www.iostabc.com/endpoint':'/endpoint')
  
  const rpc = new IOST.RPC(httpProvider)

  inject('rpc', rpc)
  inject('common', new Common($axios))

  if(!process.SERVER_BUILD) {
    window && (window.$rpc = rpc)
  }
}