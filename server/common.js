export default function API(axios) {
  axios.defaults.baseURL = 'https://www.iostabc.com/endpoint'

  const apiUrl = 'https://www.iostabc.com/api/abct'
  // const apiUrl = 'https://www.iostabc.com/api/abctest'
  const iosturl = 'https://www.iostabc.com/api'
  
  // const contract = 'ContractGBxLy1B1jfGoAWUHGDW9k8hG7NRo4owwcerJmrNTK8xZ'
  const contract = 'ContractAi3wmFKBRVqfpMvZ2iUL2DtrvaMPXA4JZJypWvW6WaqM'

  axios.interceptors.response.use(function (res) {
    return res.data ? res.data : Promise.reject(res)
  }, function (err) {
    return Promise.reject(err)
  })
  return {
    getContractBalcnce () {
      return axios.get(`/getTokenBalance/${contract}/iost/1`)
    },
    getTotaldestroy () {
      return axios.get(`${apiUrl}/totaldestroy`)
    },
    getTokenBalcnce (id) {
      return axios.get(`/getTokenBalance/${id}/abct/1`)
    },
    getProducerInfo (producer) {
      return axios.get(`${iosturl}/producer/${producer}`)
    },
    getPrice () {
      return axios.get(`${apiUrl}/price`)
    },
    getObtainHistory ({ page = 1, size = 10 } = {}) {
      return axios.get(`${apiUrl}/historyobtainabct`,{
        params: {
          page,
          size,
        }
      })
    },
    getIssueHistory (account, { page = 1, size = 10 } = {}) {
      return axios.get(`${apiUrl}/issueobtainabct`,{
        params: {
          account,
          page,
          size,
        }
      })
    },
    getExchangeHistory (account, { page = 1, size = 10 } = {}) {
      return axios.get(`${apiUrl}/exchangeobtainabct`,{
        params: {
          account,
          page,
          size,
        }
      })
    },
    getRechargeHistory ({ page = 1, size = 10 } = {}) {
      return axios.get(`${apiUrl}/historytopupabct`,{
        params: {
          page,
          size,
        }
      })
    },
    getRedeemHistory (account,{ page = 1, size = 10 } = {}) {
      return axios.get(`${iosturl}/pool/unvotelist`,{
        params: {
          account,
          page,
          size,
        }
      })
    },
    getTaskList({ page = 1, size = 10 } = {}){
      return axios.get(`${iosturl}/pool/speeduplist`,{
        params: {
          page,
          size,
        }
      })
    },
    getIncome(account){
      return axios.get(`${iosturl}/pool/totaldividend`,{
        params: {
          account
        }
      })
    },
    getIncomeList(account,{ page = 1, size = 10 } = {}){
      return axios.get(`${iosturl}/pool/dividendlist`,{
        params: {
          account,
          page,
          size,
        }
      })
    },
  }
}