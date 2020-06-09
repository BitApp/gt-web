<template>
  <div class="gt-body">
    <div class="gt-web-node clearfix">
      <div>
        当前账户: {{walletAccount}}
      </div>
      <div>
         <b-btn class="mt-20" block size="lg" variant="primary" @click="becomeProducer">成为出块节点</b-btn>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import IOST from 'iost'
import DiffLabel from '~/components/DiffLabel.vue'
import HistoryModal from '~/components/HistoryModal.vue'
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
      walletAccount: "",
      tokenBalance: 0,
    }
  },
  head() {
    return {
      title: 'GUILD_TOKEN'
    }
  },
  mounted(){
    this.initIwallet()
  },  
  methods:{

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
            }
          })
        }
      }, 1000);
    },

    becomeProducer() {
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI(contract, "registerProducer", [
        "BkHuWzs6x2wUcuDwcodwQSaWUfZHiN7SfF3vBKy1U2Qg",
        "12D3KooWPKHXNMy6xc6yqoHEgWp9f8FB9hmokEPNcknT1FHWMCP8",
        "China",
        "https://gt.bitapp.net"
        ])
      ctx.gasLimit = 1000000
      const _this = this
      iost.signAndSend(ctx).on("pending", (trx) => {
        alert("恭喜清风兄已成为出块节点，IOST一百，别墅靠海!")
      })
      .on('success', (result) => {
        // alert(`兑换${this.exchangeNumber}GT≈${this.fixedNumber(this.exchangeNumber * 0.066)}GT成功`)
      })
      .on('failed', (failed) => {
      })
    }
  },

  watch: {
  },
  
  beforeDestroy(){
    clearInterval()
  }
}
</script>

<style lang="scss" scoped>
.gt-body{
  padding: 0 calc(50% - 280px);
  min-width: 350px;
  font-size: 14px;
  .gt-web-node {
    padding: 30px 20px;
  }
}
</style>

