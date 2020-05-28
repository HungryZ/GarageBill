// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let data = event.data
    data._openid = cloud.getWXContext().OPENID
    let newRecord = await db.collection(event.collectionName).add({
      data: data
    })
    return {
      succeed: true,
      _id: newRecord._id
    }
  } catch (e) {
    console.error(e)
    return {
      succeed: false,
      error: e
    }
  }
}