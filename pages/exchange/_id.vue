<template>
  <div class="gt-body">
    <b-alert
      :variant="variant"
      fade
      :show="dismissCountDown"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
    <div>{{alertText}}</div>
      <div class="mt-2" v-if="faileddes != ''">
        {{faileddes.message||faileddes}}
      </div>
    </b-alert>
    <div class="gt-web-exchange clearfix">
      <div class="title-bar">
        <i>
         <svg viewBox="0 0 20 20"
          class="back" @click=" () => { $router.back(); }">
            <path fill="#718096" d="M12.452,4.516c0.446,0.436,0.481,1.043,0,1.576L8.705,10l3.747,3.908c0.481,0.533,0.446,1.141,0,1.574  c-0.445,0.436-1.197,0.408-1.615,0c-0.418-0.406-4.502-4.695-4.502-4.695C6.112,10.57,6,10.285,6,10s0.112-0.57,0.335-0.789  c0,0,4.084-4.287,4.502-4.695C11.255,4.107,12.007,4.08,12.452,4.516z"/>
          </svg>
        </i>
        <span class="prod-name">{{ prod.name }}</span>
        <i>
        </i>
      </div>
      <div class="prod-content">
        <div>
          <img :src="prod.imgs[0]" alt="">
        </div>
        <div class="text-panel">
          <div class="prod-name">{{prod.name}}</div>
          <div class="price">
            <span class="label">价格: </span>
            <span class="value">{{ prod.price + " " + prod.token }}</span>
          </div>
          <div class="sep"></div>
          <p class="desc">
            {{prod.desc}}
          </p>
        </div>
        <div class="button-panel">
          <b-btn class="mt-20 btn-exhange" block size="lg" variant="primary" @click="exchange">兑换</b-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import IOST from 'iost'
import DiffLabel from '~/components/DiffLabel.vue'
import HistoryModal from '~/components/HistoryModal.vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import TipsModal from '~/components/TipsModal.vue'
import UnVoteModal from '~/components/UnVoteModal.vue'
import { mapState } from "vuex"
import cookies from "~/plugins/cookies"
import {contract, gtPrice, nodeAddr, DAY_MAX} from "~/plugins/variables"

export default {
  components: {
  },
  computed:{
    ...mapState(["lang"]),
  },
  data () {
    return {
      alertText: '',
      faileddes:'',
      dismissSecs: 5,
      dismissCountDown: 0,
      walletAccount: "",
      tokenbalance: 0,
      variant: 'danger',
      prod: {
        pId: "5eaef31e266b8727f84f170e",
        name: "努比亚·红魔5G【骇客黑】",
        desc: "8GB+128GB 骁龙865 风冷散热、游戏音效增强、游戏显示增强、游戏震感、游戏性能模式、游戏灯效",
        price: 3888888,
        token: "guild_token",
        inventory: 3,
        timeStep: 0,
        weChat: "lzh19288",
        imgs: [
        "https://gt.bitapp.net/static/products/nubia.jpg"]
      }
    }
  },
  head() {
    return {
      title: 'GUILD_TOKEN'
    }
  },
  mounted(){
    this.initIwallet()
    //资金池
    this.$common.getContractBalance().then( res =>{
      this.contractBalance = res
    })
    this.$common.getProducerInfo(nodeAddr).then( res => {
      this.producerVotes = res.votes
    })
  },  
  methods:{

    getAccountInfo () {
      this.$rpc.blockchain.getAccountInfo(this.walletAccount,true).then(account => {
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)
      })
    },

    initIwallet(){
      const _this = this
      var timeInterval = setInterval(() => {
        if (window.IWalletJS) { 
          window.IWalletJS.enable().then((account) => {
          if(!account) {
            _this.walletAccount = null
          } else {
            clearInterval(timeInterval)
            _this.walletAccount = account
            _this.$store.commit('setWalletAccount', account) 
            _this.getAccountInfo()
            _this.$common.getTokenBalcnce(account).then( res =>{
              _this.tokenbalance = res.balance
            })
          }
        })
        }
      }, 1000);
    },

    fixedNumber(numbers,fixed){
      fixed = fixed || 2
      if (!numbers) {
        return 0
      }
      let number = new Number(numbers)
      number = number.toFixed(10)
      let str = "^(.*\\..{" + fixed + "}).*$" 
      number = String(number).replace( new RegExp(str),"$1")
      number = Number(number)
      return number
    },

    exchange () {
      if (this.prod.price > this.tokenbalance) {
        alert(this.prod.token + "余额不足")
      } else {
        if(confirm(`确定兑换${this.prod.name} ？`)){
          const iost = IWalletJS.newIOST(IOST)
          const ctx = iost.callABI(contract, "buyProduct", [this.prod.pId])
          ctx.gasLimit = 300000
          const _this = this
          iost.signAndSend(ctx).on('pending', (trx) => {
            alert("")
          })
          .on('success', (result) => {
            // alert(`兑换${this.exchangeNumber}GT≈${this.fixedNumber(this.exchangeNumber * 0.066)}GT成功`)
          })
          .on('failed', (failed) => {
            alert("兑换失败")
          })
        }
      }
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
  },

  watch: {
  },
  
  beforeDestroy(){
    clearInterval()
  }

  // async asyncData({ req, app, query, $axios }) {
  //   const ip = await $axios.$get('http://icanhazip.com')
  //   return {
  //     ip: ip
  //   }
  // },
}
</script>

<style lang="scss" scoped>
.gt-body{
  padding: 0 calc(50% - 280px);
  min-width: 350px;
  font-size: 14px;
  .gt-web-exchange {
    padding: 30px 20px;
    .mt-8 {
      margin-top: 8px;
    }
    .title-bar {
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      .back {
        width: 20px;
        height: 20px;
      }
    }
    .prod-content {
      display: inline-block;
      margin-top: 10px;
      width: 100%;
      background: white;
      border-radius: 8px;
      padding-bottom: 20px;
      img {
        border-radius: 8px;
        width: 100%;
      }
      .text-panel {
        padding: 0 14px;
        margin-top: 4px;
        .prod-name, .price {
          margin-top: 2px;
          overflow: hidden;
          height: 28px;
          line-height: 28px;
          text-overflow: ellipsis;
          white-space: nowrap;
          color :#3E3E3E;
          margin-bottom: 10px;
        }
        .prod-name{
          font-size: 14px;
          font-weight: bold;
        }
        .price {
          display: flex;
          justify-content: space-between;
          .value {
            color: #007bff;
          }
        }
      }
      .sep {
        height: 1px;
        background: #F5F6F9;
        margin: 10px 0;
      }
      .desc {
        color:#8E8E8E;
      }
      .button-panel {
        padding: 0 14px;
      }
    }
  }
}
</style>

