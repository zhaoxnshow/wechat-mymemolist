// miniprogram/pages/myMemoList/myMemoList.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
    ],
    defaultImgUrls: [
      { idx:0, filePath: 
      'https://7a78-zxntest-91c827-1257736798.tcb.qcloud.la/1.jpeg?sign=1010c9b0bcaade27493181d8aba57a4d&t=1552552836'},
      { idx:1, filePath: 
      'https://7a78-zxntest-91c827-1257736798.tcb.qcloud.la/2.jpeg?sign=0b25e195be29acea9985d587300d469b&t=1552552882'},
      {idx:2, filePath: 
      'https://7a78-zxntest-91c827-1257736798.tcb.qcloud.la/3.jpg?sign=0e39570075bd3529d51fd52d82e80ec5&t=1552552952'}
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    vertical: false,
    previousMargin: 0,
    nextMargin: 0,
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    items: [],
    myOpenId: '',
    mockdata: [{
      idx: 0,
      what: 'this is a template',
      when: '2016-09-15'
    }, {
        idx: 1,
        what: 'this is a template',
        when: '2016-09-15'
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _that = this
    // wx.getSavedFileList({
    //   success: (res) => {
    //     if (res.fileList != null && res.fileList.length > 0) {
    //       _that.setData({ imgUrls: res.fileList })
    //     }
    //     else{
    //       _that.setData({ imgUrls: this.data.defaultImgUrls })
    //     }
    //   }
    // })
    this.setDisplayImg();

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        _that.setData({ myOpenId: app.globalData.openid})
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取 openid 失败，请检查是否有部署 login 云函数',
        })
        console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
      }
    })
  },

  setDisplayImg: function(){
    let _that = this
    wx.getSavedFileList({
      success: (res) => {
        if (res.fileList != null && res.fileList.length > 0) {
          _that.setData({ imgUrls: res.fileList })
          console.log('=========');
          console.log(_that.data.imgUrls);
          console.log('=========');
        }
        else {
          _that.setData({ imgUrls: this.data.defaultImgUrls })
        }
      }
    })
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
  clickMe: function() {
    console.log('-------clickMe-------')

    console.log('-------clickMe-------')
  },
  choosePhoto: function() {
    let _that = this
    wx.chooseImage({
      count: 100,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let fsm = wx.getFileSystemManager();
        console.log('test1:' + tempFilePaths.length)
        for(let i = 0; i < tempFilePaths.length; i++) {
          fsm.saveFile({
            tempFilePath: tempFilePaths[i],
            success(res) {
              const savedFilePath = res.savedFilePath
              console.log('i=' + i + ';test2:' + savedFilePath)
              if (i == tempFilePaths.length - 1){
                wx.showToast({
                  title: '显示选择图片',
                })
                _that.setDisplayImg()
              }
            }
          })
        }
      }
    })
  },
  clearPhotos: function() {
    let _that = this
    wx.getSavedFileList({
      success(res) {
        let len = res.fileList.length
        for (let i = 0; i < len; i++) {
          wx.removeSavedFile({
            filePath: res.fileList[i].filePath,
            complete(res) {
              console.log('i=' + i + ';remove successful!')
              if (i == len - 1){
                wx.showToast({
                  title: '显示默认图片',
                })
                _that.setDisplayImg()
              }
            }
          })
        }
      }
    })
  },
  searchMemo: function(obj){
    let _that = this
    const db = wx.cloud.database()
    db.collection('counters').where({
      _openid: this.data.myOpenId
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功11: ', res.data)
        _that.setData({ items: res.data})
        console.log('test data+++++==' + _that.data.items)
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
  addMemo: function(obj){
    wx.navigateTo({
      url: '../addMemo/addMemo'
    })
  },
  onSuccess(res) {
    console.log(res.detail)
  },
  onFail(res) {
    console.log(res)
  }
})