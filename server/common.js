export default function API(axios) {
  axios.defaults.baseURL = 'https://www.iostabc.com/endpoint'

  const apiUrl = '/api'
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
      return axios.get(`/getTokenBalance/${contract}/iost/1`)
    },
    getTotaldestroy () {
      return axios.get(`${apiUrl}/totaldestroy`)
    },
    getTokenBalcnce (id) {
      return axios.get(`/getTokenBalance/${id}/guild_token/1`)
    },
    getProducerInfo (producer) {
      return axios.get(`${iosturl}/producer/${producer}`)
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
    }
  }
}