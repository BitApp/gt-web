<template>
  <div class="abct-web-index">
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
    <div>
      <b-form-select v-model="language" :options="langs" @change="changeLang"></b-form-select>
    </div>
    <div class="top-view mt-10">
      <div class="top-img-view">
        <p class="font-weight-bold fs-22">ABCT POOL</p>
        <p>综合年化收益 20% + ABCT 双挖</p>
      </div>
      <div class="price-view">
        <div>
          <img class="switch" src="~/assets/imgs/icon_switch.svg" @click="priceChange" width="15">
          <no-ssr>
            <span :class="[`font-norwester ml-1 ${font_size}`]" >1 ABCT = <div id="price"></div>{{`${changeType=='ratio'?' IOST':/cn/i.test(lang.lang)?' CNY':' USD'}`}}</span>
          </no-ssr>
          <span class="fs-14"><DiffLabel slot="activator" :diff="changeType=='ratio'?priceInfo.percent_change_ratio:priceInfo.percent_change_price" :formatter="(text) => fixedNumber(text * 100,2) + '%'" tag="sup" class="fz-12" /></span>
        </div>
        <div class="pool-tip-item">1. 两种参与方式（投票参与和挖矿参与）</div>
        <div class="pool-tip-item">2. 独创的加速任务玩法，不投票也能轻松赚收益</div>
        <div class="pool-tip-item"><span>3. 挖矿就送 ABCT</span> <span class="ml-5 abct-tip" @click="ruleModal('abct')">什么是ABCT ></span> </div>
      </div>
    </div>
    <!-- <div class="records mt-15" style="overflow:hidden">
      <div v-if="historyInfo" :class="['animated', historyDirect ==='in'?'slideInUp':'slideOutUp', 'infinite', 'slow']">
        {{historyInfo.name + '\xa0'}} 刚刚获得了 {{ '\xa0'+fixedNumber(historyInfo.amount,4) + '\xa0'}} ABCT 
      </div>
    </div> -->
    <div class="poolinfo-view mt-15">
      <div class="poolinfo-tip-item">矿池总量：{{poolInfo.votes}}</div>
      <div class="poolinfo-tip-item">7日年化利率：</div>
      <div class="poolinfo-tip-item">已发放收益：{{poolIncome}}</div>
    </div>
    <div class="tabs-view mt-15">
      <b-tabs
        active-nav-item-class="font-weight-bold active-tab"
        nav-class="btab"
        content-class="tab-content-view"
        align="center" 
        fill>
        <b-tab title="挖矿" active >
          <div class="pool" v-if="isVote">
            <div class="income-view">
              <p>我的收益</p>
              <p class="list-text" @click="historyModal('income')">收益记录</p>
            </div>
            <div class="income-view">
              <div>
                <p>总收益</p>
                <p>{{fixedNumber(accountIncome,4)  + '\xa0'}}IOST</p>
              </div>
              <div>
                <p>上周期收益</p>
                <p>{{fixedNumber(lastIncome,4) +'\xa0'}}IOST</p>
              </div>
              <div>
                <p>本金</p>
                <p>{{fixedNumber(accountPoolNumber,4)+'\xa0'}}IOST</p>
              </div>
            </div>
            <div class="income-view">
              <div>
                <div class="pool-btn exchange-btn" @click="isVote = false;isBack = true">追加</div>
                <div class="pool-btn vote-btn" @click="$refs.redeemModal.show()">赎回</div>
              </div>
              <p class="list-text" @click="historyModal('redeem')">赎回记录</p>
            </div>
          </div>
          <div class="pool" v-else>
            <div class="input-view">
              <p class="lable-text">参与额度</p>
              <b-form-input focus type="number" autocomplete="off" size="sm" v-model="votepoolNumber" @update="poolChange()"></b-form-input>
              <b-input-group-append>
                <div class="input-append">IOST</div>
              </b-input-group-append>
            </div>
            <div class="income-view">
              <p>预估收益</p>  
              <p>{{fixedNumber(votepoolincome,5)+'\xa0'}} IOST/日</p>
            </div>
            <div class="vote-btn" @click="votePool">马上参与享20% 年化收益</div>
            <div v-if="isBack" class="back-view"> <p @click="isVote = true">返回</p> </div>
            <div class="income-view">
              <p>可随时赎回，无锁定期，全网最低手续费</p>
              <p style="min-width:80px;color:#FF768A;" @click="toContract">查看合约 ></p>
            </div>
          </div>
        </b-tab>
        <b-tab title="投票">
          <div class="vote">
            <div class="vote-content d-flex">
              <div class="w100p">
                <div>我的IOST：{{fixedNumber(accountInfo.balance,6)}}</div>
                <div class="on-voting d-flex mt-2">
                  <span>投票中的IOST：{{votebalances}}</span>
                </div>
                <div class="frozen-line mt-2">
                    <span>冻结中的IOST：{{frozenbalances}}</span>
                    <b-link style="color:#FF768A;" @click="unvoteModal()">马上赎回</b-link>
                  </div>
              </div>
            </div>
            <div class="vote-btn mt-20" @click="toRoute('vote')">投票免费抢</div>
            <div class="tips-view mt-15">
              <span @click="historyModal('issue')">我的分红记录</span>
              <span @click="ruleModal('issue')">发行规则</span>
            </div>
          </div>
        </b-tab>
        <b-tab title="任务">
          <div v-if="taskList && taskList.length > 0">
            <div class="task-view" v-for="(item,index) in taskList" :key="index">
              <div class="task-info">
                <span>{{item.amount + '\xa0'}}IOST</span> <span>{{item.timeLen+'\xa0'}}天</span> <span>收益:{{'\xa0'+ fixedNumber(item.profitAmount,4)}}</span>
              </div>
              <div class="task-btn vote-btn" @click="$refs.speedModal.show();speedInfo = item;">赚取收益</div>
            </div>
          </div>
          <div v-else style="text-align:center;">
            暂无数据
          </div>
          <div class="task-list" @click="historyModal('task')">任务记录</div>
        </b-tab>
      </b-tabs>
    </div>
    <div class="exchange mt-20">
      <div class="exchange-tip">
        <div class="abct-text fb">我的ABCT：{{tokenbalance}}</div>
        <div class="fb">
          <div>1 ABCT = {{ '\xa0'+fixedNumber(priceInfo.price_ratio,6)+'\xa0'}}IOST  = {{/cn/i.test(lang.lang)?(fixedNumber(priceInfo.price_cny,6) +'\xa0'+'CNY'):(fixedNumber(priceInfo.price_usd,6)+'\xa0'+'USD')}} </div>
        </div>
        <div class="exchange-pool mt-15">
          <span>兑换资金池：{{fixedNumber(contractBalance.balance,2)+ '\xa0 IOST'}}  </span>
          <img class="icon_largerise" src="~/assets/imgs/icon_largerise2.svg">
        </div>
        <div class="exchange-pool mt-15">
          <span>总兑换/销毁：{{fixedNumber(totaldestroy.total_destroy,2)+ '\xa0 ABCT' + '\xa0 = \xa0' + fixedNumber(totaldestroy.total_destroy*priceInfo.price_ratio,2) + '\xa0 IOST'}}  </span>
        </div>
      </div>
      <div class="tips-view mt-15" @click="historyModal('recharge')">资金池充值记录</div>
      <div class="exchange-btn mt-20" @click="toRoute('exchange')" >兑换IOST</div>
      <div class="tips-view mt-15">
        <span @click="historyModal('exchange')">我的兑换记录</span>
        <span @click="ruleModal('exchange')">兑换规则</span>
      </div>
    </div>
    <div class="tip-view mt-15" v-if="(ref != 'purewallet' && ref != 'tp')">
      <img v-if="/cn/i.test(this.lang.lang)" class="wallet-img" style="width:200px;height:400px" src="~/assets/imgs/wallet_cn.png">
      <img v-else class="wallet-img" style="width:200px;height:400px" src="~/assets/imgs/wallet_en.png">
      <div class="qrcode">
        <div class="code-img"><img src="~/assets/imgs/download.svg" alt=""></div>
        <div class="mt-15">扫码下载PureWallet，随时管理你的ABCT收益</div>
      </div>
    </div>
    <HistoryModal ref="historyModal" @toTaskInfo="taskInfo"/>
    <TipsModal ref="tipsModal" />
    <UnVoteModal ref="unvoteModal" @unVote="unvoteTip" />
    <div class="mask-view" v-show="isloading">
      <div class=" ld ld-spinner ld-spin-fast" style="font-size:64px;color:#8da"></div>
    </div>
    <b-modal ref="statusModal">
      <div style="color:#000;">{{modalText}}</div>
      <div style="color:#721c24">{{txMessage}}</div>
      <template slot="modal-footer" slot-scope="{cancel}">
        <b-button v-if="txhash != ''" size="sm" variant="info" @click="toTxHash">
          查看交易结果
        </b-button>
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
    <b-modal ref="redeemModal" centered>
      <div>
        <b-form-input v-model="unvotepoolNumber" placeholder="redeem number" type="number" autocomplete="off"></b-form-input>
      </div>
      <template slot="modal-footer" slot-scope="{cancel}">
        <b-button size="sm" variant="info" @click="unVotePool">
          确定
        </b-button>
        <b-button size="sm" @click="cancel(unvotepoolNumber = '')">
          Cancel
        </b-button>
      </template>
    </b-modal>
    <b-modal ref="speedModal" centered>
      <div>
        <b-form-input v-model="speedNumber" placeholder="speed number" type="number" autocomplete="off"></b-form-input>
      </div>
      <template slot="modal-footer" slot-scope="{cancel}">
        <b-button size="sm" variant="info" @click="speed(speedInfo)">
          确定
        </b-button>
        <b-button size="sm" @click="cancel(speedNumber = '')">
          Cancel
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import Vue from "vue"
import DiffLabel from '~/components/DiffLabel.vue'
import HistoryModal from '~/components/HistoryModal.vue'
import TipsModal from '~/components/TipsModal.vue'
import UnVoteModal from '~/components/UnVoteModal.vue'
import { CountUp } from 'countup.js/dist/countUp';
import { mapState } from "vuex"
import cookies from "~/plugins/cookies"
import IOST from 'iost'

const POOLContract = 'Contract2aTDVrGVdTMCAM14JWJ4wG9C7FVmAKQedB8yqgPDbciS'
export default {
  components: {
    DiffLabel,
    TipsModal,
    HistoryModal,
    UnVoteModal
  },
  computed:{
    ...mapState(["lang"]),
  },
  data () {
    return {
      dayABCT: 864000,
      isBack:false,
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
      font_size:'fs-20',
      changeType:'ratio',
      isloading: false,
      txhash:'',
      modalText:'',
      txMessage:'',
      language:'zh_Hans_CN',
      ref:'',
      producerInfo:{},
      
      dismissSecs: 3,
      dismissCountDown: 0,
      variant:'danger',
      alertText:'',
      faileddes:'',
      isshowModal:false,//避免弹框两次
      
      speedNumber:'',
      speedInfo:{},
      poolIncome:0,
      votepoolincome:'',
      accountIncome:0,
      lastIncome:0,
      isAppend:false,
      isVote:false,
      poolInfo:{},
      votepoolNumber:'',
      unvotepoolNumber:'',
      accountPoolNumber:0,
      taskList:[],
      langs:[
        {value:"en_US",text:'English'},
        {value:"zh_Hans_CN",text:'简体中文'},
        {value:"zh_Hant_HK",text:'繁體中文'},
      ]
    }
  },
  head() {
    return {
      title: 'ABCT',
      ip: null,
    }
  },
  mounted(){
    this.initIwallet()
    //资金池
    this.$common.getContractBalcnce().then( res =>{
      this.contractBalance = res
    })
    //已兑换的ABCT
    this.$common.getTotaldestroy().then( res =>{
      this.totaldestroy = res
    })
    //节点信息
    this.$common.getProducerInfo('iostabc').then( res => {
      this.producerInfo = res
    })
    this.navigator = window.navigator
    //价格
    this.getPoolInfo()
    this.getPriceDown()
    // this.getObtainHistory()
    this.getTaskList()
    
    if (/ios|ipad|iphone/i.test(navigator.userAgent)) {
      if (window.innerWidth < 400){
        this.font_size = 'fs-18'
      }
    } else {
      if (window.innerWidth < 400) {
        this.font_size = 'fs-17'
      }
    }
    this.ref = this.$route.query.ref || window.sessionStorage.getItem('ref') || ''
    window.sessionStorage.setItem('ref',this.ref)
    this.language = /cn/i.test(this.lang.lang)? 'zh_Hans_CN':/en/i.test(this.lang.lang)?'en_US':'zh_Hant_HK'
  },  
  methods:{
    //账户信息
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo(this.walletAccount,true).then(account => {
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)
      })
      this.$rpc.blockchain.getContractStorage(POOLContract,this.walletAccount,true).then(res =>{
        if (res.data == 'null') {
          this.isVote = false
          return
        }
        this.isVote = true
        this.accountPoolNumber = res.data * 1
      })
      this.$common.getIncome(this.walletAccount).then( res => {
        this.accountIncome = res.amount
      })
      this.$common.getIncomeList(this.walletAccount,{page:1,size:1}).then( res =>{
        if (res.data.length) {
          this.lastIncome = res.data[0].amount
        }
      })
    },
    getPoolInfo(){
      this.$rpc.blockchain._getContractVote(POOLContract,true).then(res =>{
        this.poolInfo = res.vote_infos[0]
      })
      this.$common.getIncome().then(res => {
        this.poolIncome = res.amount
      })
    },
    toTxHash(){
      if (this.txhash) {
        window.location = `https://www.iostabc.com/tx/${this.txhash}`
      }
    },
    toContract(){
      window.location = `https://www.iostabc.com/contract/${POOLContract}`
    },
    taskInfo(task){
      this.speedInfo = task
      this.$refs.speedModal.show()
    },
    speed(item){
      let speedNumber = this.speedNumber * 1
      if (speedNumber < 1 ) {
        this.variant = 'danger'
        this.alertText = '加速数量不能小于1'
        this.dismissCountDown = this.dismissSecs
        return
      }
      if (speedNumber > this.accountInfo.balance) {
        this.variant = 'danger'
        this.alertText = '加速数量超过可使用余额'
        this.dismissCountDown = this.dismissSecs
        return
      }
      if (speedNumber > item.amount) {
        this.variant = 'danger'
        this.alertText = '加速数量超过可加速总量'
        this.dismissCountDown = this.dismissSecs
        return
      }
      this.isshowModal = false
      this.modalText = `加速完成，数量:${this.fixedNumber(speedNumber, 6) +'\xa0'}IOST 赚取收益:${this.fixedNumber(item.profitAmount,4)+'\xa0'}IOST`
      this.txMessage = ''

      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI(POOLContract, "speedUp", [this.walletAccount,item.hash,speedNumber.toString()])
      ctx.gasLimit = 300000
      iost.signAndSend(ctx).on('pending', (trx) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.$refs.speedModal.hide()
          this.getAccountInfo()
          this.getTaskList()
          this.txhash = trx
          this.speedNumber = ''
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `speedUp`, //类型 exchange
            eventAction: `speedUp`, 
            eventLabel:`account:${this.walletAccount},amount:${speedNumber},status:success,txhash:${trx}`,
            eventValue: parseInt(speedNumber)
          })
        }
      })
      .on('success', (result) => {
        if (result.tx_hash) {
          this.getAccountInfo()
          this.getTaskList()
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.$refs.speedModal.hide()
          this.txhash = result.tx_hash
          this.speedNumber = ''
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `speedUp`, 
            eventAction: `speedUp`, 
            eventLabel:`account:${this.walletAccount},amount:${speedNumber},status:success,txhash:${result.tx_hash}`,
            eventValue: parseInt(poolnumber) 
          })
        }
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        if (!this.isshowModal) {
          this.$refs.speedModal.hide()
          this.isshowModal = true
          this.modalText = '加速失败'
          this.txhash = failed.tx_hash ? failed.tx_hash:''
          this.txMessage = JSON.stringify(failed)
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `speedUpFailed`, 
            eventAction: `speedUp`, 
            eventLabel:`account:${this.walletAccount},amount:${speedNumber},message:${JSON.stringify(failed)}`,
          })
        }
      })

    },
    votePool(){
      let poolnumber = this.votepoolNumber * 1
      if (poolnumber < 1 ) {
        this.variant = 'danger'
        this.alertText = '数量不能小于1'
        this.dismissCountDown = this.dismissSecs
        return
      }
      if (poolnumber > this.accountInfo.balance) {
        this.variant = 'danger'
        this.alertText = '数量超过可使用余额'
        this.dismissCountDown = this.dismissSecs
        return
      }
        
      this.isshowModal = false
      this.modalText = `参与挖矿完成，数量:${this.fixedNumber(poolnumber, 6) +'\xa0'}IOST`
      this.txMessage = ''

      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI(POOLContract, "vote", [this.walletAccount,poolnumber.toString()])
      ctx.gasLimit = 300000
      iost.signAndSend(ctx).on('pending', (trx) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.getAccountInfo()
          this.txhash = trx
          this.votepoolNumber = ''
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `voteToPool`, //类型 exchange
            eventAction: `voteToPool`, 
            eventLabel:`account:${this.walletAccount},amount:${poolnumber},status:success,txhash:${trx}`,
            eventValue: parseInt(poolnumber)
          })
        }
      })
      .on('success', (result) => {
        if (result.tx_hash) {
          this.getAccountInfo()
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.votepoolNumber = ''
          this.txhash = result.tx_hash
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `voteToPool`, 
            eventAction: `voteToPool`, 
            eventLabel:`account:${this.walletAccount},amount:${poolnumber},status:success,txhash:${result.tx_hash}`,
            eventValue: parseInt(poolnumber) 
          })
        }
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.modalText = '兑换失败'
          this.votepoolNumber = ''
          this.txhash = failed.tx_hash ? failed.tx_hash:''
          this.txMessage = JSON.stringify(failed)
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `voteToPoolFailed`, 
            eventAction: `voteToPool`, 
            eventLabel:`account:${this.walletAccount},amount:${poolnumber},message:${JSON.stringify(failed)}`,
          })
        }
      })
    },
    unVotePool(){
      let poolnumber = this.unvotepoolNumber
      if (poolnumber <= 0 ) {
        this.variant = 'danger'
        this.alertText = '数量不能小于0'
        this.dismissCountDown = this.dismissSecs
        return
      }
      if (poolnumber > this.accountPoolNumber) {
        this.variant = 'danger'
        this.alertText = '数量超过可使用余额'
        this.dismissCountDown = this.dismissSecs
        return
      }
        
      this.isshowModal = false
      this.modalText = `取消挖矿完成，数量:${this.fixedNumber(poolnumber, 6) +'\xa0'}IOST`
      this.txMessage = ''

      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI(POOLContract, "unvote", [this.walletAccount,poolnumber.toString(),'0.0002',true])
      ctx.gasLimit = 300000
      iost.signAndSend(ctx).on('pending', (trx) => {
        if (!this.isshowModal) {
          this.$refs.redeemModal.hide()
          this.getTaskList()
          this.getPoolInfo()
          this.isshowModal = true
          this.txhash = trx
          this.unvotepoolNumber = ''
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `UnvoteToPool`, //类型 exchange
            eventAction: `UnvoteToPool`, 
            eventLabel:`account:${this.walletAccount},amount:${poolnumber},status:success,txhash:${trx}`,
            eventValue: parseInt(poolnumber)
          })
        }
      })
      .on('success', (result) => {
        if (result.tx_hash) {
          this.getAccountInfo()
        }
        if (!this.isshowModal) {
          this.$refs.redeemModal.hide()
          this.getTaskList()
          this.getPoolInfo()
          this.isshowModal = true
          this.unvotepoolNumber = ''
          this.txhash = result.tx_hash
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `UnvoteToPool`, 
            eventAction: `UnvoteToPool`, 
            eventLabel:`account:${this.walletAccount},amount:${poolnumber},status:success,txhash:${result.tx_hash}`,
            eventValue: parseInt(poolnumber) 
          })
        }
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        if (!this.isshowModal) {
          this.$refs.redeemModal.hide()
          this.isshowModal = true
          this.modalText = '兑换失败'
          this.unvotepoolNumber = ''
          this.txhash = failed.tx_hash ? failed.tx_hash:''
          this.txMessage = JSON.stringify(failed)
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `UnvoteToPoolFailed`, 
            eventAction: `UnvoteToPool`, 
            eventLabel:`account:${this.walletAccount},amount:${poolnumber},message:${JSON.stringify(failed)}`,
          })
        }
      })
    },
    poolChange(){
      if (!this.votepoolNumber) {
        this.votepoolincome = 0
        return
      }
      var vote = ((0.5 * 210000000)/this.producerInfo.total_votes)/365
      var voteReward = vote * this.votepoolNumber * 1 //投票收益 1 天
      var abctReward = ((this.votepoolNumber || 0)/parseInt(this.producerInfo.votes)) * this.dayABCT * 1 * 1
      var iostReward = abctReward * this.priceInfo.price_ratio
      this.votepoolincome = voteReward + iostReward
    },
    getPrice(){
      this.$common.getPrice().then( res =>{
        this.priceInfo = res
        this.priceTimePercent = (+new Date() -  new Date(this.priceInfo.created_at)) / (600 * 1000)
        if (this.changeType == 'price') {
          if (/cn/i.test(this.lang.lang)) {
            this.startPrice = this.priceInfo.price_cny_10m_ago + (this.priceInfo.price_cny - this.priceInfo.price_cny_10m_ago) * this.priceTimePercent
            this.endPrice = this.priceInfo.price_cny
          } else {
            this.startPrice = this.priceInfo.price_usd_10m_ago + this.priceTimePercent * (this.priceInfo.price_usd - this.priceInfo.price_usd_10m_ago)
            this.endPrice = this.priceInfo.price_usd
          }
        } else {
          this.startPrice = this.priceInfo.price_ratio_10m_ago + this.priceTimePercent * (this.priceInfo.price_ratio - this.priceInfo.price_ratio_10m_ago)
          this.endPrice = this.priceInfo.price_ratio
        }
        this.priceAnmate()
      })
    },
    unvoteTip(data){
      if (data.message) {
        this.txMessage = data.message
      }
      this.modalText = data.text
      this.txhash = data.txhash
      this.getAccountInfo()
      this.$refs.statusModal.show()
    },
    changeLang(item){
      const date = new Date();
      const expire = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      cookies.setItem(document, "lang", item, expire, "/");
      location.href = location.origin
    },
    getPriceDown(){
      this.getPrice()
      setInterval(() => {
        this.getPrice()
      },610 * 1000)
    },
    priceAnmate(){
      const options = {
        startVal: this.fixedNumber(this.startPrice ,10),
        decimalPlaces: 10,
        useEasing: false,
        duration: 610 * (1 - this.priceTimePercent),
      };
      let countdown = new CountUp('price', this.fixedNumber(this.endPrice ,10), options)
      if (!countdown.error) {
        countdown.start()
      } else {
        console.error(countdown.error);
      }
    },
    priceChange(){
      this.priceTimePercent = (+new Date() -  new Date(this.priceInfo.created_at)) / (600 * 1000)
      if (this.changeType == 'ratio') {
        if (/cn/i.test(this.lang.lang)) {
          this.startPrice = this.priceInfo.price_cny_10m_ago + (this.priceInfo.price_cny - this.priceInfo.price_cny_10m_ago) * this.priceTimePercent
          this.endPrice = this.priceInfo.price_cny
        } else {
          this.startPrice = this.priceInfo.price_usd_10m_ago + this.priceTimePercent * (this.priceInfo.price_usd - this.priceInfo.price_usd_10m_ago)
          this.endPrice = this.priceInfo.price_usd
        }
        this.changeType = 'price'
      } else {
        this.startPrice = this.priceInfo.price_ratio_10m_ago + this.priceTimePercent * (this.priceInfo.price_ratio - this.priceInfo.price_ratio_10m_ago)
        this.endPrice = this.priceInfo.price_ratio
        this.changeType = 'ratio'
      }
      this.priceAnmate()
    },
    onReady(instance, CountUp) {
      const that = this
      instance.update(that.endVal + 100)
    },
    historyModal(type){
      this.$refs['historyModal'].showModal(type)
    },
    ruleModal(type){
      this.$refs['tipsModal'].showModal(type)
    },
    unvoteModal(){
      this.$refs['unvoteModal'].showModal()
    },
    //路由
    toRoute (route) {
      this.$router.push(`/${route}`)
    },
    historyChange(){
      this.historyInfo = this.historyList[this.showIndex]
      this.historyDirect = 'in'
      setTimeout(()=>{
        this.historyDirect = 'out'
      },2000)

      var timeInterval = setInterval(() => {
        if (this.showIndex > 19) {
          this.showIndex = 0
        }
        this.historyInfo = this.historyList[this.showIndex]
        this.historyDirect = 'in'
        setTimeout(()=>{
          this.historyDirect = 'out'
        },2000)
        this.showIndex ++
      }, 4000);
    },
    getObtainHistory(){
      //历史获得记录
      this.$common.getObtainHistory().then( res =>{
        this.historyList = res.data
        this.showIndex = 0
        this.historyChange()
      })
    },
    getTaskList(){
      this.$common.getTaskList({page:1,size:2}).then( res =>{
        this.taskList = res.data
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
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
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

<style lang="scss">
.abct-web-index {
  padding: 15px;
  .mt-8 {
    margin-top: 8px;
  }
  .top-view {
    border-radius: 10px;
    background-color: #1F166B;
    .top-img-view{
      background: url(~assets/imgs/banner.svg) 0 0 round; 
      height: 75px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .price-view{
      padding: 20px 15px 10px;
      #price{
        text-align: left;
        width: 110px;
        display: inline-block;
      }
      .rising {
        color: #0DB767;
      }
      .pool-tip-item{
        line-height: 25px;
        .abct-tip{
          color: #FF768A;
          font-size: 12px;
        }
      }
    }
  }
  .records {
    text-align: center;
    color: #eee;
    animation-duration: 2.01s;
    animation-iteration-count: infinite;
  }
  .poolinfo-view{
    padding: 10px 15px;
    background-color: #1F166B;
    color: #FFF;
    border-radius: 10px;
    .poolinfo-tip-item{
      line-height: 25px;
    }
  }
  .tabs-view{
    padding: 0 15px;
    background-color: #1F166B;
    border-radius: 10px;
    .btab{
      border: none;
      font-size: 16px;
    }
    .active-tab{
      color: #69EFF9 !important;
      border: none;
      border-bottom: 1px solid #69EFF9;
      background-color: transparent;
    }
    .nav-tabs .nav-link{
      color: #FFF;
    }
    .tab-content-view{
      padding: 10px 0;
    }
    .vote {
      a{
        color:#FF768A;
      }
      .vote-content {
        align-items: center;
        background: #1F166B;
        border-radius: 8px;
        .on-voting {
          justify-content: space-between;
        }
        .frozen-line{
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .pool{
      .input-view{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .form-control{
          color: #FFF;
          background-color: #0F0258;
          border: none;
        }
        .form-control:focus{
          box-shadow: none;
          background-color: #0F0258;
          color: #FFF;
        }
        .lable-text{
          width: 120px;
        }
        .input-append{
          width: 60px;
          line-height: 31px;
          text-align: center;
          background-color: #0F0258;
        }
      }
      .income-view{
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        align-items: center;
        .pool-btn{
          display: inline-block;
          line-height: 30px;
          font-size: 14px;
          width: 90px;
          border-radius: 6px;
        }
        .pool-btn:first-child{
          margin-right: 20px;
        }
        .list-text{
          color: #FF768A;
        }
      }
      .back-view{
        display: flex;
        padding: 10px;
        justify-content: center;
        align-items: center;
        color: #FF768A;
      }
    }
    .task-view{
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      align-items: center;
      .task-info{
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-right: 15px;
        background-color: #0F0258;
        height: 35px;
      }
      .task-btn{
        display: inline-block;
        line-height: 35px;
        font-size: 15px;
        width: 90px;
      }
    }
    .task-list{
      display: inline-block;
      line-height: 35px;
      color: #FF768A;
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
      padding: 15px;
      background-color:#1F166B;
      .exchange-pool{
        .icon_largerise{
          height: 11px;
        }
        border-top: 1px solid #322886;
        padding-top: 10px;
      }
      .abct-text{
        line-height: 30px;
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
</style>

