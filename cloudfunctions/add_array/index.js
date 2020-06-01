// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let collectionName = event.collectionName
  let dataArray = event.dataArray

  let tasks = []
  dataArray.forEach(data => {
    const promise = cloud.callFunction({
      name: 'add',
      data: {
        collectionName: collectionName,
        data: data
      }
    })
    tasks.push(promise)
  });
  // 等待执行所有
  const results = (await Promise.all(tasks)).map(res => {
    return res.result
  })
  console.log('执行结果：', results)
  var allSucceed = true
  for (let i = 0; i < results.length; i++) {
    let result = results[i]
    if (!result.succeed) {
      allSucceed = false
      break
    }
  }

  return {
    succeed: allSucceed,
    results: results
  }
}