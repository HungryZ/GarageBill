// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    await db.collection(event.collectionName).doc(event._id).update({
      data: event.data
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