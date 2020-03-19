<template>
  <div>
    <b-modal ref="vote-modal" hide-footer class="modal">
      <div class="nodata-view" v-if="voteList.length<1">
        暂无数据
      </div>
      <div v-else>
        <b-list-group >
          <b-list-group-item class="item" v-for="(item,index) in voteList" :key="index">
            <span>节点：{{item.option}} <span v-if="item.option === nodeAddr" style="color:red;font-size: 12px;">(双挖中)</span></span> <span >票数：{{item.votes}}</span>  <div class="unvote-btn" @click="selectNode(item)">取消投票</div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-modal>
    <b-modal  ref="unvote-confim-modal" class="modal">
      <div class="modal-text">
        赎回的IOST7天之后才会到账，确定赎回吗?
      </div>
      <template slot="modal-footer" slot-scope="{cancel}">
        <b-button size="sm" variant="info" @click="unVote()">
          确定
        </b-button>
        <b-button size="sm" @click="cancel()">
          取消
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import IOST from 'iost'
import { nodeAddr } from "~/plugins/variables"

export default {
  data() {
    return{
      voteList:[],
      walletAccount:'',
      selectItem:{},
      isshowModal:false,//避免弹框两次
    }
  },
  methods:{
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo(this.walletAccount,true).then(account => {
        let votelist = account.vote_infos
        // this.voteList = votelist.filter(item => item.option != nodeAddr)
      })
    },
    showModal(){
      this.walletAccount = this.$store.getters.getWalletAccount
      this.getAccountInfo()
      this.$refs['vote-modal'].show()
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    selectNode(item){
      this.$refs['vote-modal'].hide()
      this.$refs['unvote-confim-modal'].show()
      this.selectItem = item
    },
    unVote(){
      let item = this.selectItem
      this.$refs['unvote-confim-modal'].hide()
      this.isshowModal = false
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI('vote_producer.iost', "unvote", [this.walletAccount, item.option, item.votes.toString()])
      ctx.gasLimit = 300000
      iost.signAndSend(ctx).on('pending', (trx) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.$emit('unVote',{status:'pending',text:`撤回投票完成,撤回投给${'\xa0'+item.option+'\xa0' + item.votes+'\xa0'}票`,txhash:trx})
          ga('send','event',{
            eventCategory: `Unvote`, //类型 unvote  
            eventAction: `Unvote`, 
            eventLabel:`account:${this.walletAccount},producer:${item.option},amount:${item.votes},status:success,txhash:${trx}`,
            eventValue: parseInt(item.votes) //投票的数量 失败为0 不统计
          })
        }
      })
      .on('success', (result) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.$emit('unVote',{status:'success',text:`撤回投票完成,撤回投给${'\xa0'+item.option+'\xa0' + item.votes+'\xa0'}票`,txhash:result.tx_hash})
          ga('send','event',{
            eventCategory: `Unvote`, //类型 unvote  
            eventAction: `Unvote`, 
            eventLabel:`account:${this.walletAccount},producer:${item.option},amount:${item.votes},status:success`,
            eventValue: parseInt(item.votes) //投票的数量 失败为0 不统计
          })
        }
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.$emit('unVote',{status:'failed',text:'取消投票失败',txhash:failed.tx_hash?failed.tx_hash:'',message:JSON.stringify(failed)})
          ga('send','event',{
            eventCategory: `UnvoteFaild`, //类型 unvote  
            eventAction: `Unvote`, 
            eventLabel:`account:${this.walletAccount},producer:${item.option},amount:${item.votes},message:${JSON.stringify(failed)}`,
          })
        }
      })
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
  .modal-text{
    line-height: 30px;
    color: #000;
  }
  .item{
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .unvote-btn{
      display: inline-block;
      background-color: #007bff;
      padding: 5px 10px;
      color: #FFF;
      border-radius: 5px;
    }
  }
}


</style>


