<template>
  <div class="gt-body">
    <div class="gt-web-index clearfix">
      <div class="fr">
        <b-form-select v-model="language" :options="langs" @change="changeLang"></b-form-select>
      </div>
      <b-tabs pills>
        <b-tab title="投票" active>
          <div class="vote-web-view">
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
                <no-ssr>
                <countdown class="number" :time="(nextHalve-currentBlock) * 500">
                  <template slot-scope="props">{{ props.days }} 天{{ props.hours }} 小时{{ props.minutes }} 分{{ props.seconds }} 秒</template>
                </countdown>
                </no-ssr>
              </div>
            </div>
            <div class="mt-15 info-view">
              <div class="info-line" @click="voteNumber = fixedNumber(accountInfo.balance,6)">我的IOST：{{fixedNumber(accountInfo.balance,6)}}</div>
              <div class="info-line">投票中的IOST：{{votebalances}}</div>
              <div class="frozen-line">
                <span>冻结中的IOST：{{frozenbalances}}</span>
                <b-link @click="unvoteModal">马上赎回</b-link>
              </div>
            </div>
            <div class="exchange-info mt-20">
              <div class="icon-view">
                <img class="icon-img" src="@/assets/imgs/icon_token.svg">
                <img class="icon-to" src="@/assets/imgs/icon_to.svg">
                <img class="icon-img" src="@/assets/imgs/icon_gt.svg">
              </div>
              <div class="font-norwester fs-20 scale-title mt-20">
                1 GT = 0.066 IOST
              </div>
              <div class="scale-desc">投票给 hibtc 节点即可免费获得 GT</div>
              <b-input-group>
                <b-form-input type="number" v-model="voteNumber" placeholder="请输入投票数量" @update="inputChange" autocomplete="off"></b-form-input>
                <b-input-group-append>
                  <div class="all-btn" @click="voteNumber = fixedNumber(accountInfo.balance,0);inputChange()">全部</div>
                </b-input-group-append>
              </b-input-group>
              <div style="padding:10px">
                <div class="scale-tip">当前hibtc总票数{{'\xa0'+parseInt(producerVotes) + '\xa0'}}, 投 {{'\xa0'+(voteNumber || 0)+'\xa0'}} IOST 给 hibtc，每天可分得 {{'\xa0'+fixedNumber(abctNumber,6) + '\xa0'}} hibtc </div> 
                <div class="scale-tip mt-2 fb">{{fixedNumber(abctNumber,6) + '\xa0'}} hibtc = {{'\xa0'+fixedNumber(iostNumber,6) + '\xa0'}} IOST = {{fixedNumber(priceNumber,6) + (/cn/i.test(lang.lang)?' CNY':' USD')}}</div>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab title="回购">
          <div class="exchange-web-view mt-20">
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
            <div>
              <p class="mt-20">说明:</p>
              <p class="mt-10">1. 清风链游戏公益积分 GUILD_TOKEN，简称GT总发行量21亿</p>
              <p>2. 每天固定发行5万Token，按照投票用户的投票占比清风链节点总得票数的比例分得</p>
              <p>3. 每过一年，发行量将减少一半</p>
              <p>4. 清风链官方将每月固定配发5万IOST以0.066 IOST/GT 的汇率回购GT代币</p>
              <p>5. 清风链将在未来推出积分商城，大家可以使用GT兑换商城里的任意物品，包括实物和虚拟物品等</p>
              <p>6. 本活动最终解释权归清风链游戏公社所有</p>
            </div>
          </div>
          <HistoryModal ref="historyModal" />
        </b-tab>
        <b-tab title="商城"><p class="mt-20 ta-c">商城即将上线，敬请期待</p></b-tab>
      </b-tabs>
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
      contractBalance:{},
      accountInfo:{},
      tokenbalance:0,
      // votebalances:0,
      // frozenbalances:0,
      navigator:{},
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
        // this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        // this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)
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
      this.exchangeNumber = this.fixedNumber(this.exchangeNumber, 0)
      if (this.exchangeNumber > this.tokenbalance) {
        alert("GT余额不足")
      } else {
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
    .vote-web-view{
      .info-view{
        padding: 15px;
        background: #2A3657;
        .info-line{
          line-height: 25px;
        }
        .frozen-line{
          display: flex;
          justify-content: space-between;
        }
      }
      .exchange-info{
        padding: 15px;
        background: #2A3657;
        .icon-view{
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-img{
            height: 40px;
          }
          .icon-to{
            margin: 0 10px;
            height: 15px;
          }
        }
        #price{
          display: inline-block;
          width: 140px;
        }
        .switch{
          margin-left:5px;
        }
        .scale-title{
          text-align: center;
        }
        .scale-desc{
          text-align: center;
          padding: 20px;
        }
        .scale-tip{
          line-height: 20px;
          color: rgba(255, 255, 255, 0.6);
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
    .exchange-web-view {
      .banner{
        border-radius: 8px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .exchange-tip{
        padding: 20px;
        border-radius: 8px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
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
  }
}
</style>

