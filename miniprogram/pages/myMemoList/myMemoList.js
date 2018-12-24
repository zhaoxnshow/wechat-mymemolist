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
      { filePath: 
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'},
      { filePath: 
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'},
      { filePath: 
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'}
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
    index: 0,
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
    wx.getSavedFileList({
      success: (res) => {
        if (res.fileList != null && res.fileList.length > 0) {
          _that.setData({ imgUrls: res.fileList })
        }
        else{
          _that.setData({ imgUrls: this.data.defaultImgUrls })
        }
      }
    })

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
                _that.onLoad()
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
                _that.onLoad()
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
  }
})