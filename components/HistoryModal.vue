<template>
  <b-modal  ref="history-modal" class="modal" hide-footer @hide="modalHide">
    <div class="nodata-view" v-if="exchangeList.length == 0">
      暂无数据
    </div>
    <div v-else>
      <b-list-group v-if="exchangeList.length>0">
        <b-list-group-item class="item"  v-for="(item,index) in exchangeList" :key="index">
          <span>GT数量：{{item.amount}}</span> 
          <!--<span class="ml-2">兑换IOST数量：{{item.iost_amount}}</span>--> 
          <span class="ml-2">交易：<b-link target="_blank" :href="'https://www.iostabc.com/tx/' + item.hash">{{item.hash.slice(0,8) + "..." + item.hash.slice(-8)}}</b-link></span>
          <span class="ml-2">所在区块：{{item.block}}</span>
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
      type:'',
      exchangeList:[],
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
      this.totalCount = 0
      this.pagination.page = 1
    },
    pageChange(page){
      if (page == this.pagination.page) {
        return
      }
      this.pagination.page = page
      this.getList()
    },
    getList(){
      this.$common.getExchangeHistory(this.walletAccount, this.pagination).then( res =>{
        this.exchangeList = res.data
        this.totalCount = res.total
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
  .item{
    color: #000;
  }
  .pagination-view{
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}


</style>


