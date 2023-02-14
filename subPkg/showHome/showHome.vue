<template>
  <view class="a">
    <uni-popup ref="message" type="message">
    	<uni-popup-message :type="popType" :message="err" :duration="2000"></uni-popup-message>
    </uni-popup>
    <uni-transition :mode-class="modeClass" :styles="styles" :show="show" :duration="time">
      <span class="txt">欢迎，{{name}}！</span>
    </uni-transition>
    <view class="my">
      <view class="newPassword">
        <input :type="passwordIcon" placeholder="新密码" v-model="newPassword">
        <uni-icons :type="eyeIcon" size="24" class="icon" @click="cut"></uni-icons>
      </view>
      <view class="notarize">
        <input :type="passwordIcon" placeholder="确认密码" v-model="notarize" @input="comparison">
          <uni-icons :type="eyeIcon" size="24" class="icon2" @click="cut"></uni-icons>
          <uni-icons :type="icon" size="24" :color="color" v-show="T" class="icon3"></uni-icons>
      </view>
      <button type="default" plain size="mini" @click="updatePassword" 
      :disabled="disable" :loading="loading">确定</button>
    </view>
  </view>
</template>

<script>
  import { ref, watch } from "vue";
import store from "../../store/store";
  export default {
    setup() {
      let show = ref("")
      let modeClass = ref(['fade', 'zoom-in'])
      let styles = ref({
        marginTop: "5vh",
        textAlign: "center",
        lineHeight: "50px",
        fontSize: "30px"
      })
      let name = store.state.perInfo.姓名
      let time = ref(3000)
      // 判断密码是否一致
      let T = ref(false)
      let icon = ref("closeempty")
      let newPassword = ref("")
      let notarize = ref("")
      let color = ref("red")
      let passwordIcon = ref("password")
      let eyeIcon = ref("eye-slash")
      let disable = ref(true)
      let loading = ref(false)
      let message = ref(null)
      let err = ref("")
      let popType = ref("error")
      
      watch(()=> store.state.collapseItem,(newVal,oldVal)=>{
        if(newVal === -1 ) show.value = true
        else if(newVal === "" && show.value === false) show.value = false
        else if(newVal === "" && show.value === true) show.value = true
        else show.value = false
      })
      
      // 获取焦点（确认密码框），实时判断密码
      function comparison(){
        if(newPassword.value === "" || notarize.value === "") {
          T.value = true
          icon.value = "closeempty"
          color.value = "red"
          disable.value = true
        }
        else if(newPassword.value !== notarize.value){
          T.value = true
          icon.value = "closeempty"
          color.value = "red"
          disable.value = true
        }
        else{
          icon.value = "checkmarkempty"
          color.value = "rgb(17, 211, 17)"
          disable.value = false
        }
      }
      // 切换密文
      function cut(){
        if(passwordIcon.value === "password"){
          passwordIcon.value = "text"
          eyeIcon.value = "eye"
        }
        else{
          passwordIcon.value = "password"
          eyeIcon.value = "eye-slash"
        }
      }
      // 发起请求，更改密码
      async function updatePassword(){
        try{
          disable.value = true
          loading.value = true
          let res = await uni.request({
            url:"http://localhost:3000/updatePassword",
            method:"GET",
            data:{username:store.state.perInfo.username,password:newPassword.value,chart:store.state.jurisdiction}
          })
          disable.value = false
          loading.value = false
          if(typeof(res.data) === "string"){
            err.value = res.data
            message.value.open()
          }
          else{
            disable.value = true
            err.value = "密码修改成功,1s后回到登录页"
            popType.value = "success"
            message.value.open()
            setTimeout(()=>{
              uni.reLaunch({
                url:"/pages/login/login"
              })
            },1000)
          }
        }catch(err){
          disable.value = false
          loading.value = false
          err.value = res.data
          message.value.open()
        }
      }
      return {
        show,
        modeClass,
        styles,
        time,
        name,
        T,
        newPassword,
        notarize,
        icon,
        color,
        comparison,
        passwordIcon,
        eyeIcon,
        cut,
        updatePassword,
        disable,
        loading,
        err,
        message,
        popType
      };
    }
  }
</script>

<style lang="scss">
.a{
  padding: 10px;
  position: absolute;
  top: 50%;
  box-sizing: border-box;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  height: 95%;
  background-color: white;
  z-index: 55;
  box-shadow: 1px 3px 19px 4px rgba(0, 0, 0, 0.41);
  .txt{
    background-image: linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%);
    color: transparent;
    background-clip: text;
  }
  .my{
    width: 80%;
    height: 80%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .newPassword{
      display: flex;
      align-items: center;
      position: relative;
      top: 0;
      left: 0;
      .icon{
        position: absolute;
        left: 20vw;
        transform: translate(-100%,100%);
      }
    }
    // 双密码验证
    .notarize{
      display: flex;
      align-items: center;
      position: relative;
      top: 0;
      left: 0;
      .icon2{
        position: absolute;
        left: 20vw;
        transform: translate(-100%,100%);
      }
      .icon3{
        position: absolute;
        left: 20vw;
        transform: translate(0,100%);
      }
    }
    input{
      margin-top: 6vh;
      width: 20vw;
      height: 4vh;
      border: 1px solid rgba(0, 0, 0, 0.41);
      border-radius: 5px;
      padding: 5px;
      box-sizing: border-box;
    }
    button{
      width: 20vw;
      height: 6vh;
      margin-top: 6vh;
      text-align: center;
      line-height: 6vh;
      font-size: 25px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      background: linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%);
    }
  }
}
</style>
