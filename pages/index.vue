<template>
  <div class="gt-body">
    <div class="gt-web-index">
      <div>
        <b-form-select v-model="language" :options="langs" @change="changeLang"></b-form-select>
      </div>
      <div class="banner-bg mt-10">
        <div class="banner">
          <div class="title">清风链游戏公益积分 GT（GUILD_TOKEN)</div>
          <div class="banner-content d-flex">
            <div class="banner-content-left">
              <div class="mt-8">
                <div>1. 总量 21亿 / 2. 超级回购计划</div>
                <div>3. 每年减半 / 4. 可随时兑换 IOST</div>
                <div>5. 积分商城即将上线</div>
              </div>
            </div>
            <img class="icon-gt" src="~/assets/imgs/icon_gt.svg" width="75">
          </div>
        </div>
      </div>
      <div class="countdown mt-15">
        <div class="countdown-content d-flex">
          <div>减半倒计时：</div>
          <div class="number">
            <countdown :time="(nextHalve-currentBlock) * 500">
              <template slot-scope="props">{{ props.days }} 天{{ props.hours }} 小时{{ props.minutes }} 分{{ props.seconds }} 秒</template>
            </countdown>
          </div>
        </div>
      </div>
      <div class="exchange mt-20">
        <div class="exchange-tip">
          <div class="abct-text d-flex">
            <div class="fb">
              我的GT：{{tokenbalance}}
            </div>
            <div>
              <b-btn variant="link" size="sm" @click="exchangeNumber = tokenbalance">全部</b-btn>
            </div>
          </div>
          <div class="exchange-pool">
            <b-input-group>
              <b-form-input focus type="number" min=1 v-model="exchangeNumber" step="1" placeholder="请输入兑换数量" autocomplete="off"></b-form-input>
              <b-input-group-text><strong>0.066 IOST / GT</strong></b-input-group-text>
            </b-input-group>
            <div class="mt-20">
              <b-btn block size="lg" variant="primary" @click="exchange">兑换</b-btn>
            </div>
            <div class="mt-15 ta">
              <b-btn variant="link" @click="historyModal">查看兑换记录 ></b-btn>
            </div>
          </div>
          <div class="exchange-pool mt-15">
            <span>兑换资金池：{{fixedNumber(contractBalance.balance,2)+ '\xa0 IOST'}}  </span>
            <img class="icon_largerise" src="~/assets/imgs/icon_largerise2.svg">
          </div>
          <div class="exchange-pool mt-15">
            <span>总兑换：{{fixedNumber(totalExchange, 2)+ '\xa0 GT' + '\xa0 = \xa0' + fixedNumber(totalExchange * 0.066,2) + '\xa0 IOST'}}  </span>
          </div>
        </div>
      </div>
      <HistoryModal ref="historyModal" />
      <!--<TipsModal ref="tipsModal" />-->
      <div class="mask-view" v-show="isloading">
        <div class=" ld ld-spinner ld-spin-fast" style="font-size:64px;color:#8da"></div>
      </div>
      <b-modal ref="statusModal">
        <div style="color:#000;">{{modalText}}</div>
        <template slot="modal-footer" slot-scope="{cancel}">
          <b-button v-if="txhash != ''" size="sm" variant="info" @click="toTxHash">
            查看交易结果
          </b-button>
          <b-button size="sm" @click="cancel()">
            Cancel
          </b-button>
        </template>
      </b-modal>
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
// import UnVoteModal from '~/components/UnVoteModal.vue'
import { mapState } from "vuex"
import cookies from "~/plugins/cookies"
import {contract} from "~/plugins/variables"

export default {
  components: {
    DiffLabel,
    TipsModal,
    HistoryModal,
    VueCountdown
  },
  computed:{
    ...mapState(["lang"]),
  },
  data () {
    return {
      walletAccount:'',
      priceInfo:{},
      contractBalance:{},
      accountInfo:{},
      historyList:[],
      historyInfo:null,
      historyDirect:'in',
      showIndex:0,
      tokenbalance:0,
      votebalances:0,
      frozenbalances:0,
      navigator:{},
      startPrice:'',
      endPrice:'',
      totaldestroy:'',
      priceTimePercent:0,
      changeType:'ratio',
      exchangeNumber: 0, 
      isloading: false,
      txhash:'',
      modalText:'',
      language:'zh_Hans_CN',

      currentBlock: 0,
      nextHalve: 0,
      totalExchange: 0,
      ref:'',
      langs:[
        {value:"en_US",text:'English'},
        {value:"zh_Hans_CN",text:'简体中文'},
        {value:"zh_Hant_HK",text:'繁體中文'},
      ]
    }
  },
  head() {
    return {
      title: 'GUILD_TOKEN',
      ip: null,
    }
  },
  mounted(){
    this.initIwallet()
    //资金池
    this.$common.getContractBalance().then( res =>{
      this.contractBalance = res
    })
    this.getContractInfo();
    this.navigator = window.navigator

    this.ref = this.$route.query.ref || window.sessionStorage.getItem('ref') || ''
    window.sessionStorage.setItem('ref',this.ref)
    this.language = /cn/i.test(this.lang.lang)? 'zh_Hans_CN':/en/i.test(this.lang.lang)?'en_US':'zh_Hant_HK'
  },  
  methods:{
    //账户信息
    getContractInfo(){
      this.$rpc.blockchain.getContractStorage(contract, "HALVE_BLOCK", true).then(data => {
        this.nextHalve = data.data
        this.currentBlock = data.block_number
      })

      this.$rpc.blockchain.getContractStorage(contract, "TOTAL_EXCHANGE", true).then(data => {
        this.totalExchange = data.data || 0
      })
    },
    getAccountInfo () {
      this.$rpc.blockchain.getAccountInfo(this.walletAccount,true).then(account => {
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)
      })
    },
    toTxHash(){
      if (this.txhash) {
        window.location = `https://www.iostabc.com/tx/${this.txhash}`
      }
    },

    changeLang(item){
      const date = new Date();
      const expire = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      cookies.setItem(document, "lang", item, expire, "/");
      location.href = location.origin
    },

    historyModal(type){
      this.$refs['historyModal'].showModal(type)
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
      this.exchangeNumber = fixedNumber(this.exchangeNumber, 0)
      if(this.exchangeNumber> 0 && confirm(`确定兑换${this.exchangeNumber}GT≈${this.fixedNumber(this.exchangeNumber * 0.066)}吗？`)){
        const iost = IWalletJS.newIOST(IOST)
        const ctx = iost.callABI(contract, "exchange", [this.walletAccount, this.exchangeNumber])
        ctx.gasLimit = 300000
        const _this = this
        iost.signAndSend(ctx).on('pending', (trx) => {
          alert(_this.exchangeNumber + "GT 兑换完成，请等待交易确认")
          _this.exchangeNumber = 0
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
  .gt-web-index {
    padding: 30px 20px;
    
    .mt-8 {
      margin-top: 8px;
    }
    // box-shadow: #111 1px 1px 0;
    .banner{
      border-radius: 8px;
      background: #2A3657;
      .title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        background: #39AFFF;
        color:white;
        padding: 10px;
        border-radius: 8px;
      }
      .banner-content {
        padding: 10px;
        align-items: center;
        height: 100%;
        .banner-content-left{
          margin-left:12px;
          flex: 1;
        }
      }
    }
    .countdown {
      a {
        color:#39AFFF;
      }
      .countdown-content {
        padding: 20px;
        align-items: center;
        background: #2A3657;
        border-radius: 8px;
        justify-content: space-between;
        .number {
          font-weight: bold;
          color: #39AFFF;
        }
      }
    }
    .tip-view {
      display: flex;
      .qrcode{
        flex: 1;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .code-img{
          text-align: left;
        }
      }
    }
    .tips-view{
      display: flex;
      justify-content: space-between;
      color: rgba(255, 255, 255, 0.7);
    }
    .exchange{
      .exchange-tip{
        padding: 20px;
        border-radius: 8px;
        background-color:#2A3657;
        .exchange-pool{
          .icon_largerise{
            height: 11px;
          }
          border-top: 1px solid rgb(63, 80, 126);
          padding-top: 10px;
        }
        .abct-text{
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .mask-view{
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.6);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

