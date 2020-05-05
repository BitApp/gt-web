<template>
  <b-modal ref="exchange-modal" class="modal" hide-footer @hide="modalHide">
    <div class="nodata-view" v-if="exchangeList.length == 0">
      暂无数据
    </div>
    <div v-else>
      <b-list-group v-if="exchangeList.length>0">
        <b-list-group-item class="item"  v-for="(item,index) in exchangeList" :key="index">
          <span>时间：{{new Date(item.time).toLocaleString()}}</span> 
          <span class="ml-2">商品：{{item.product.name}}</span> 
          <span class="ml-2">交易：<b-link target="_blank" :href="'https://www.iostabc.com/tx/' + item.hash">{{item.hash.slice(0,6) + "..." + item.hash.slice(-6)}}</b-link></span>
          <span class="ml-2">卖家微信：{{item.product.weChat}} (联系卖家发货)</span>
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
      exchangeList:[],
      totalCount:0,
      pagination: {
        page: 1,
        size: 10,
      }
    }
  },
  methods:{
    showModal(){
      this.walletAccount = this.$store.getters.getWalletAccount
      this.$refs['exchange-modal'].show()
      this.getList()
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
      this.$common.getProductExchangeHistory(this.walletAccount, this.pagination).then( res =>{
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


