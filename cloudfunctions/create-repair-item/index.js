// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection('repair-item')
      .add({
        data: {
          _openid: cloud.getWXContext().OPENID,
          name: event.name,
          price: event.price
        }
      })
    return {
      succeed: true
    }
  } catch (e) {
    console.error(e)
    return {
      succeed: false,
      error: e
    }
  }
}