// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
console.log('555555555');
  let formData = {
    _openid: wxContext.OPENID,
    idx: 10,
    what: 'aaaa',
    when: '2019-03-17 12:12'
  }
  debugger;
  const count = await db.collection('test_counters').count();
  await db.collection('test_counters').add({
    data: formData,
    success: res => {
      wx.showToast({
        title: '新增记录成功',
      })
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [新增记录] 失败：', err)
    }
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    mycount: count
  }
}