// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const tasks = event._idArray.map(_id => {
    return db.collection(event.collectionName).doc(_id).get()
  })

  return {
    data: (await Promise.all(tasks)).map(res => {
      return res.data[0]
    })
  }
}