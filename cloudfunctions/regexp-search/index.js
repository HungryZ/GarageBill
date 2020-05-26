// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const PAGE_SIZE = 100

// 云函数入口函数
exports.main = async (event, context) => {
  var para = {}
  if (event.value) {
    para = {
      // 正则表达式
      [`${event.field}`]: db.RegExp({
        //从搜索栏中获取的value作为规则进行匹配。
        regexp: event.value,
        //大小写不区分
        options: 'i',
      })
    }
  }
  // 先取出集合记录总数
  const countResult = await db.collection(event.collectionName).where(para).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / PAGE_SIZE)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(event.collectionName).where(para).skip(i * PAGE_SIZE).limit(PAGE_SIZE).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))
}