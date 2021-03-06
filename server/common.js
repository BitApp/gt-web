export default function API(axios) {
  const apiUrl = '/api'
  const endpointUrl = 'https://www.iostabc.com/endpoint'
  // const apiUrl = 'https://www.iostabc.com/api/abctest'
  const iosturl = 'https://www.iostabc.com/api'
  
  // const contract = 'ContractGBxLy1B1jfGoAWUHGDW9k8hG7NRo4owwcerJmrNTK8xZ'
  const contract = 'ContractF7ZjX9TT8SbaZreDUXXy4vNK2QYRngv8Tr3RJJ1oVyb5'

  axios.interceptors.response.use(function (res) {
    return res.data ? res.data : Promise.reject(res)
  }, function (err) {
    return Promise.reject(err)
  })
  return {
    getContractBalance () {
      return axios.get(`${endpointUrl}/getTokenBalance/${contract}/iost/1`)
    },
    getTotaldestroy () {
      return axios.get(`${apiUrl}/totaldestroy`)
    },
    getTokenBalance (id, token) {
      return axios.get(`${endpointUrl}/getTokenBalance/${id}/${token}/1`)
    },
    getProducerInfo (producer) {
      return axios.get(`${iosturl}/producer/${producer}`)
    },
    getProductList () {
      return axios.get(`${apiUrl}/mall/products`)
    },
    getCoinMoreList () {
      return axios.get(`${apiUrl}/cm/list`)
    },
    getProduct (pid) {
      return axios.get(`${apiUrl}/mall/products/${pid}`)
    },
    getPrice () {
      return axios.get(`${apiUrl}/price`)
    },
    getObtainHistory ({ page = 1, size = 20 } = {}) {
      return axios.get(`${apiUrl}/historyobtainabct`,{
        params: {
          page,
          size,
        }
      })
    },
    getExchangeHistory (account, { page = 1, size = 20 } = {}) {
      return axios.get(`${apiUrl}/exchanges/${account}`,{
        params: {
          page,
          size,
        }
      })
    },
    getProductExchangeHistory (account, { page = 1, size = 20 } = {}) {
      return axios.get(`${apiUrl}/mall/dealRecord?buyer=${account}`,{
        params: {
          page,
          size,
        }
      })
    },
    getCMExchangeHistory(account,  { page = 1, size = 20 } = {}) {
      return axios.get(`${apiUrl}/cm/cmHistory?from=${account}`,{
        params: {
          page,
          size,
        }
      })
    },
    getCMOpenHistory({ page = 1, size = 20 } = {}) {
      return axios.get(`${apiUrl}/cm/openHistory`,{
        params: {
          page,
          size,
        }
      })
    }
  }
}