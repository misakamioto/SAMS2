<template>
  <view class="top">
    <view class="logo">
      <image src="../../static/logo/陕西邮电职业技术学院.png" class="logoBack"></image>
      <h3>学生成绩管理系统</h3>
    </view>
    <view class="logOut">
      <uni-icons type="contact" size="20"></uni-icons>
      <text>{{name}}</text>
      <uni-icons type="bottom"></uni-icons>
      <view class="hover display" @click="quit">
        退出登录
      </view>
    </view>
  </view>
  <!-- 内容区 -->
  <view class="content">
    <!-- 折叠面板 -->
    <collapse></collapse>
    <!-- 数据展示区 -->
    <show></show>
  </view>
</template>

<script>
import { ref } from "vue";
import store from "../../store/store";
import collapse from "@/subPkg/collapse/collapse.vue"
import show from "@/subPkg/show/show.vue"
  export default {
    components:{
      collapse,
      show
    },
    setup() { 
      let name = store.state.perInfo.姓名
      function quit(){
        store.commit("quit","")
        uni.reLaunch({
          url:"/pages/login/login"
        })
      }
      return {
        name,
        quit
      };
    }
  }
</script>

<style lang="scss" scoped>
  body{
    padding: 0px 20px;
    box-sizing: border-box;
    background-color: white;
  }
.top{
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:20px;
  .logo{
    display: flex;
    align-items: center;
    .logoBack{
      width: 30px;
      height: 30px;
    }
    h3{
      margin-left: 10px;
    }
  }
  .logOut{
    width: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transform: translateY(20%);
    position: relative;
    top: 0;
    left: 0;
    z-index: 999;
    .hover{
      width: 70px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 1px 3px 19px 4px rgba(0,0,0,0.41);
      position: absolute;
      transform: translateY(75%);
      background-color: white;
      z-index: 99999;
      cursor: pointer;
    }
    .display{
      display: none;
    }
  }
  .logOut:hover .display{
    display: block;
  }
}
.content{
  display: flex;
  background-color: white;
}
</style>
