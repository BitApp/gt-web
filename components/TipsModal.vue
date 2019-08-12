<template>
  <b-modal  ref="tips-modal" hide-footer class="modal">
    <template slot="modal-title">
     <div style="color:#000" class="fs-22 fb">{{titleOption[type]}}</div>
    </template>
    <b-card class="mb-2" body-class="center-body">
      <b-card-text class="modal-text-info">
        <div v-if="type == 'abct'">
          <p class="tips-title fs-20 fb ">什么是 ABCT</p>
          <p class="tips-info-text">ABCT是IOSTABC团队基于IOST主网投票收益的利润，在IOST网络上发行的权益代币，只要给IOSTABC账户投票的用户，除了享受IOSTABC作为第一梯队节点的高额回报之外，我们还将根据你的投票数量，每天定时定量的派发ABCT，参与投票就相当于参与ABCT挖矿，持有的ABCT可以随时兑换成IOST</p>
        </div>
        <div v-if="type == 'abct' || type == 'issue' " class="mt-10">
          <p class="tips-title fs-20 fb ">发行规则</p>
          <div>
            <b-table stacked outlined :items="tabitems" :fields="fields"></b-table>
          </div>
          <img style="width:100%" v-if="/cn/i.test(lang.lang)" src="~/assets/imgs/icon_issue.png">
          <img style="width:100%" v-else src="~/assets/imgs/icon_issue_en.png">
          <p class="tips-info-text">现阶段ABCT将以免费赠与的方式发行，总量20亿，以天为周期定量解锁，每天最多解锁864000。</p>
          <p class="tips-info-text">1. 投票给IOSTABC节点的用户，将参与瓜分每天的864000个ABCT，根据投票数占IOSTABC总票池的比例自动分发。</p>
          <p class="tips-info-text">2. 另外会不定期做一些活动赠与部分ABCT，这部分具体数⽬要视情况⽽定。</p>
        </div>
        <div v-if="type == 'abct' || type == 'exchange' " class="mt-10">
          <p class="tips-title fs-20 fb ">兑换规则</p>
          <p class="tips-info-text">1. 你可以在任何时间把ABCT兑换成IOST，我们会每天把IOSTABC节点奖励收益的50%充值到兑换奖金池，兑换奖金池的余额越多，兑换的价格就越高。</p>
          <p class="tips-info-text">2. 兑换得到的IOST即时到账。</p>
          <p class="tips-info-text">3. 完成兑换ABCT立即销毁。</p>
        </div>
        <div v-if="type == 'emogi'">
          <p class="tips-title fs-20 fb">IOSTABC将持续购入50万LOL表情币空投给ABCT持有者</p>
          <br/>
          <p class="tips-info-text">为答谢广大投票用户对于IOSTABC的支持以及对ABCT的持有，IOSTABC将分五期，持续购入50万表情币，并连同官方持续空投的LOL表情币一起，空投给所有的ABCT持币用户</p>
          <br/>
          <p class="tips-info-text"><span class="fb">每期空投数量 = </span><span>你的ABCT持仓 / ABCT总流通 * 当期空投总量</span></p>
          <br/>
          <p class="tips-info-text"><span class="fb">空投日期：</span><span>第一期空投将于 2019年8月25日进行，空投总量为10万LOL表情币，我们将会在8月24日进行ABCT快照，并根据余额快照进行配发，届时大家可以下载PureWallet管理自己的LOL资产</span></p>
          <br/>
          <p class="tips-info-text"><span class="fb">后续计划：</span><span>后续空投具体日期以公告为准，我们会不断把福利带给ABCT持币者</span></p>
          <br/>
          <p class="tips-info-text"><span class="fb">LOL表情币：</span><span>LOL表情币将于2019年8月15日通过优选通道（Huobi Prime）上线火币交易所，限价期的两轮限定价格分别为：$0.000952, $0.001905</span></p>
          <br/>
          <p class="tips-info-text"><span class="fb">LOL表情币：</span><span>LOL表情币将于2019年8月15日通过优选通道（Huobi Prime）上线火币交易所，限价期的两轮限定价格分别为：$0.000952, $0.001905</span></p>
          <br/>
          <p class="tips-info-text" v-if="/cn/i.test(lang.lang)">关于LOL表情币：<a href="https://media.weibo.cn/article?id=2309404403420126642222" rel="noopener noreferrer">https://media.weibo.cn/article?id=2309404403420126642222</a></p>
          <p class="tips-info-text" v-else>关于LOL表情币：<a href="https://medium.com/@IOSTABC/500k-lol-airdrop-to-abct-holders-5e5f877b0588" rel="noopener noreferrer">https://medium.com/@IOSTABC/500k-lol-airdrop-to-abct-holders-5e5f877b0588</a></p>
          <br/>
          <p class="tips-info-text"><span class="fb">BISS投票：</span><span>在BISS上投票的用户因为暂时无法派发ABCT，所以将无法享受此次空投</span></p>
        </div>
      </b-card-text>
    </b-card>
  </b-modal>
</template>

<script>

import { mapState } from "vuex"

export default {
  data(){
    return {
      titleOption:{
        abct:'什么是ABCT？',
        issue:'发行规则？',
        exchange:'兑换规则',
        emogi:'空投规则'
      },
      type:'abct',
      fields:[
        {key:'vote',label:'我的票数'},
        {key:'abctnumber',label:'我的ABCT/日'},
        {key:'voteincome',label:'投票收益/日'},
        {key:'otherincome',label:'额外收益/日'},
        {key:'votes',label:'节点票数(浮动)'},
        {key:'iostnumber',label:'回购资金/日'},
        {key:'abctday',label:'ABCT发行量/日'},
        {key:'abctprice',label:'兑换价格'},
      ],
      tabitems:[
        {vote:'100,0000', abctnumber:26181,voteincome:'88.64 IOST',otherincome:'181.8125 IOST', votes:'3300万', iostnumber:'6000 IOST', abctday :'864000',abctprice:'0.006944 IOST/ABCT'}
      ]
    }
  },
  computed:{
    ...mapState(["lang"]),
  },
  mounted(){
    // this.initData()
  },
  methods:{
    // initData(){
    //   this.walletAccount = this.$store.getters.getWalletAccount
    //   Promise.all([this.$rpc.blockchain.getAccountInfo(this.walletAccount)])
    // },
    showModal(type){
      this.type = type
      this.$refs['tips-modal'].show()
    }
  }
}
</script>
<style lang="scss">

.modal{
  .card{
    border: none;
  }
  .center-body{
    padding: 0px;
  }
  .modal-head{
    color: #000;
    font-weight: bold;
  }
  .modal-text-info{
    color: #000;
    .tips-title{
      margin-bottom: 10px;
    }
    .tips-info-text{
      line-height: 25px;
    }
  }
}

</style>


