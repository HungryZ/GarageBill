// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event.data)
    let data = event.data
    console.log(data)
    data._openid = cloud.getWXContext().OPENID
    console.log(data)
    await db.collection(event.collectionName).add({
      data: data
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