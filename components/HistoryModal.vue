<template>
  <b-modal  ref="history-modal" class="modal" hide-footer @hide="modalHide">
    <div class="nodata-view" 
      v-if="(issueList.length == 0 && type == 'issue') || 
      (exchangeList.length == 0&& type == 'exchange') ||  
      (rechargeHistory.length == 0&& type == 'recharge') || 
      (redeemList.length == 0 && type == 'redeem') ||
      (incomeList.length == 0 && type == 'income') ||
      (taskList.length == 0 && type == 'task')">
      暂无数据
    </div>
    <div v-else>
      <b-list-group v-if="type == 'issue'">
        <b-list-group-item class="item"  v-for="(item,index) in issueList" :key="index">
          <span>分红数量：{{item.amount}}</span> <span class="ml-2">分红块：{{item.block}}</span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-if="type == 'exchange'">
        <b-list-group-item class="item"  v-for="(item,index) in exchangeList" :key="index">
          <span>ABCT数量：{{item.abct_amount}}</span> <span class="ml-2">兑换IOST数量：{{item.iost_amount}}</span> <span class="ml-2">所在块：{{item.block}}</span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-if="type == 'recharge'">
        <b-list-group-item class="item"  v-for="(item,index) in rechargeHistory" :key="index">
          <span>IOST数量：{{item.iost_amount}}</span> <span class="ml-2">充值块：{{item.block}}</span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-if="type == 'redeem'">
        <b-list-group-item class="item"  v-for="(item,index) in redeemList" :key="index">
          <span>IOST数量：{{item.amount}}</span> <span class="ml-2">时间：{{timeToLocal(item.time)}}</span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-if="type == 'income'">
        <b-list-group-item class="item"  v-for="(item,index) in incomeList" :key="index">
          <span>分红数量：{{item.amount}}</span> <span class="ml-2">分红块：{{item.block}}</span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-if="type == 'task'">
        <b-list-group-item class="item"  v-for="(item,index) in taskList" :key="index">
          <span>数量：{{item.amount}}</span> <span class="ml-2">时间：{{item.timeLen+'\xa0'}}天</span> <span class="ml-2">收益：{{fixedNumber(item.profitAmount,4)}}</span>
          <div class="ml-2 vote-btn task-btn" @click="getIncome(item)">赚取收益</div>
        </b-list-group-item>
      </b-list-group>
      <div class="pagination-view">
        <b-pagination
          v-model="pagination.page"
          :total-rows="totalCount"
          :per-page="pagination.size"
          @change="pageChange"
          ></b-pagination>
      </div>
    </div>
    <template slot="modal-footer" slot-scope="{cancel}">
      <b-button size="sm" @click="cancel()">
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  data(){
    return{
      walletAccount:'',
      issueList:[],
      type:'',
      exchangeList:[],
      rechargeHistory:[],
      redeemList:[],
      incomeList:[],
      taskList:[],
      totalCount:0,
      pagination: {
        page: 1,
        size: 10,
      }
    }
  },
  methods:{
    showModal(type){
      this.walletAccount = this.$store.getters.getWalletAccount
      this.type = type
      this.getList(type)
      this.$refs['history-modal'].show()
    },
    modalHide(){
      this.exchangeList = []
      this.issueList = []
      this.totalCount = 0
      this.pagination.page = 1
    },
    timeToLocal(time){
      var date = new Date(time)
      return date.toLocaleString()
    },
    pageChange(page){
      if (page == this.pagination.page) {
        return
      }
      this.pagination.page = page
      this.getList(this.type)
    },
    getIncome(item){
      this.$refs['history-modal'].hide()
      this.$emit('toTaskInfo',item)
    },
    getList(type){
      if (type == 'issue') {
        this.$common.getIssueHistory(this.walletAccount,this.pagination).then( res =>{
          this.issueList = res.actions
          this.totalCount = res.total
        })
      } else if (type == 'exchange') {
        this.$common.getExchangeHistory(this.walletAccount,this.pagination).then( res =>{
          this.exchangeList = res.actions
          this.totalCount = res.total
        })
      } else if (type == 'recharge') {
        this.$common.getRechargeHistory(this.pagination).then( res =>{
          this.rechargeHistory = res.actions
          this.totalCount = res.total
        })
      } else if ( type == 'redeem') {
        this.$common.getRedeemHistory(this.walletAccount,this.pagination).then( res =>{
          this.redeemList = res.data
          this.totalCount = res.total
        })
      } else if (type == 'income') {
        this.$common.getIncomeList(this.walletAccount,this.pagination).then( res =>{
          this.incomeList = res.data
          this.totalCount = res.total
        })
      } else if (type == 'task') {
        this.$common.getTaskList(this.pagination).then( res =>{
          this.taskList = res.data
          this.totalCount = res.total
        })
      }
    },
    fixedNumber(numbers,fixed){
      if (!numbers) {
        return 0
      }
      let number = new Number(numbers)
      number = number.toFixed(10)
      let str = "^(.*\\..{" + fixed + "}).*$" 
      number = String(number).replace( new RegExp(str),"$1")
      number = Number(number)
      return number
    }
  }
}
</script>
<style lang="scss" scoped>
.modal{
  .nodata-view{
    text-align: center;
    line-height: 30px;
    color: #000;
  }
  .item{
    color: #000;
    .task-btn{
      display: inline-block;
      width: 100px;
      font-size: 14px;
      line-height: 30px;
    }
  }
  .pagination-view{
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}


</style>


