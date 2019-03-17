// miniprogram/pages/addMemo/addMemo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTime: 'HH:MM',
    selectedDate: 'YYYY-MM-DD',
    myOpenId: app.globalData.openid,
    sequenceId: '',
    showTopTips: false,

    radioItems: [
      { name: 'cell standard', value: '0' },
      { name: 'cell standard', value: '1', checked: true }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let _that = this
    const db = wx.cloud.database()
    let currSeq;

    db.collection('sequence').where({
      _openid: this.data.myOpenId
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        _that.setData({ sequenceId: res.data[0]._id})
        currSeq = res.data[0].data + 1
        let formData = {
          idx: currSeq,
          what: e.detail.value.input,
          when: e.detail.value.picker2 + ' ' + e.detail.value.picker1
        } 
        db.collection('counters').add({
          data: formData,
          success: res => {
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            db.collection('sequence').doc(_that.data.sequenceId).update({
              data: {
                data: currSeq
              },
              success: res => {
                wx.navigateBack({
                  delta: 1
                })
                cosole.log('[数据库] [更新sequence记录] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                icon: 'none',
                  console.error('[数据库] [更新记录] 失败：', err)
              }
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  formReset: function (e) {
    console.log('form发生了reset事件')
    this.setData({
      selectedTime: 'HH:MM',
      selectedDate: 'YYYY-MM-DD'
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selectedDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selectedTime: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
})