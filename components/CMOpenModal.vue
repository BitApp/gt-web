<template>
  <b-modal ref="exchange-modal" class="modal" hide-footer @hide="modalHide">
    <div class="nodata-view" v-if="openList.length == 0">
      暂无数据
    </div>
    <div v-else>
      <b-list-group v-if="openList.length>0">
        <b-list-group-item class="item"  v-for="(item,index) in openList" :key="index">
          <span>期数：{{item.coinMoreNumber}}</span> 
          <!--<span class="ml-2">兑换IOST数量：{{item.iost_amount}}</span>--> 
          <span>时间：{{new Date(item.time).toLocaleString()}}</span> 
          <span class="ml-2">获奖账户：{{item.winner}}</span>
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
      openList:[],
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
      this.$common.getCMOpenHistory(this.pagination).then( res =>{
        this.openList = res.data
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


