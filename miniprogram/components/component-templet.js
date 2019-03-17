// components/component-templet.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propA: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl: '',
    city: '',
    country: '',
    gender: '',
    language: '',
    nickName: '',
    province: '',
    args: {
      withCredentials: true,
      lang: 'zh_CN'
    }
  },

  ready() {
    console.log('======ready========');
    console.log(this.properties.propA);
  },
  attached() {
    console.log('======attached========');
    console.log(this.properties.propA);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loginSuccess(res) {
      console.log(res.detail)
    },
    loginFail(res) {
      console.log(res)
    },
    getUserInfoSuccess(res){
      this.setData(res.detail.userInfo);
      console.log(res);
    },
    onFail(e){
      console.log(e);
    },
    sayHello(){
      // 调用云函数
      wx.cloud.callFunction({
        name: 'sayHello',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          console.log(res.result.mycount);
          app.globalData.openid = res.result.openid
          wx.navigateTo({
            url: '../userConsole/userConsole',
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          wx.navigateTo({
            url: '../deployFunctions/deployFunctions',
          })
        }
      })
    },
    getLocation(){
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          console.log(res);
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
        }
      })
    },
    customLogin(){
      // wx.login({
      //   success(res) {
      //     if (res.code) {
      //       // 发起网络请求
      //       console.log('登录成功！')
      //       console.log(res);
      //     } else {
      //       console.log('登录失败！' + res.errMsg)
      //     }
      //   }
      // })
      wx.getUserInfo({
        success(res) {
          const userInfo = res.userInfo
          const nickName = userInfo.nickName
          const avatarUrl = userInfo.avatarUrl
          const gender = userInfo.gender // 性别 0：未知、1：男、2：女
          const province = userInfo.province
          const city = userInfo.city
          const country = userInfo.country
          console.log(res)
        }
      })
    }
  }
})
