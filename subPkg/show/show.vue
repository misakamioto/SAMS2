<template>
  <view class="box">
      <showHome v-show="!table"></showHome>
      <showTable v-show="table"></showTable>
    </view>
</template>

<script>
  import showTable from "@/subPkg/showTable/showTable.vue"
  import showHome from "@/subPkg/showHome/showHome.vue"
  import { ref, watch } from "vue"
import store from "../../store/store"
  export default {
    components:{
      showTable,
      showHome
    },
    setup() {
      let table = ref(false)
      watch(()=>store.state.table,(newVal,oldVal)=>{
        table.value = newVal
      })
      return {
       table
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    width: 80vw;
    height: 88vh;
    position: relative;
    top: 0;
    left: 0;
    z-index: 22;
    background-color: rgba(127, 127, 127, 0.1);
    
  }
</style>
