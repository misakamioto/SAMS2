<template>
  <view class="box">
    <view class="coll_item"  @click.prevent="show(-1)">
      <uni-icons type="home" size="25" :color="checked(-1)"></uni-icons>
      <text :class="{checked:checkedIndex === -1}">首页</text>
    </view>
    <uni-collapse accordion style="color: white;" @change="collapseChange">
      <uni-collapse-item title-border="none" v-for="(item,index) in list" :name="name[index]">
        <template v-slot:title>
          <view class="coll_item">
            <uni-icons type="settings-filled" size="25"></uni-icons>
            <text>{{item}}</text>
          </view>
        </template>
        <view class="content" v-for="(item2,index2) in icon[index]" @click.prevent="show(index2)">
          <view class="icon">
            <uni-icons :type="item2" size="20" :color="checked(index2)"></uni-icons>
          </view>
          <view class="txt">
            <text :class="{checked:index2 === checkedIndex}">{{txt[index][index2]}}</text>
          </view>
        </view>
      </uni-collapse-item>
    </uni-collapse>
  </view>
</template>

<script>
  import {onMounted, ref} from "vue";
  import store from "@/store/store.js"
  export default {
    setup() {
      let value = ""
      let list = ["成绩管理","课程管理","学生管理","教师管理","系统管理员"]
      let name = ["result","course","student","teacher","admin"]
      let icon = [["eye","gear"],["gear"],["gear"],["gear"],["gear"]]
      let txt = [["查询成绩","更新成绩"],["课程信息更新"],["学生信息更新"],["教师信息更新"],["系统管理员信息更新"]]
      // 控制选中时的样式
      let checkedIndex = ref(-1)
      // 动态设置选中的icon的颜色
      function checked(index2){
        if(index2 === checkedIndex.value) return "rgb(61, 154, 221)"
        else return ""
      }
      onMounted(()=> show(-1))
      function show(index2){
        store.commit("updataTable",[])
        store.commit("updataUsername","")
        checkedIndex.value = index2
        if(index2 === -1){
          store.commit("showTable",false)
          store.commit("updataCollapseItem",-1)
        }
        else{
          store.commit("showTable",true)
          store.commit("updataCollapseItem",index2)
        }
      }
      // 切换折叠版，重置样式
      function collapseChange(data){
        store.commit("updataCollapseItem","")
        store.commit("updataCollapse",data)
        checkedIndex.value = ""
        value = data
        store.commit("updataTable",[])
      }
      return {
        list,
        icon,
        txt,
        checkedIndex,
        checked,
        show,
        collapseChange,
        name
      };
    }
  }
</script>

<style lang="scss" scoped>
  .checked{
    color: rgb(61, 154, 221)
  }
  .coll_item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 10px;
    height: 50px;
    cursor: pointer;
  }
  text {
    font-weight: bold;
    color: black;
  }
  .box {
    height: 90vh;
    background-color: white;
    width: 25vw;
    border-top: 1px solid rgba(127, 127, 127, 0.2);
    .content{
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
</style>
