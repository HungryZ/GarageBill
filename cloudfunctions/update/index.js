// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    let data = event.data
    // _id不能改变
    if (data._id) {
      delete data._id
    }
    await db.collection(event.collectionName).doc(event._id).update({
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