// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  return db
    .collection(event.collectionName)
    .aggregate()
    .project({
      // and 操作好像有问题，不论是比较date还是int，都不能得到正确的结果
      //（测试的结果是and返回值跟第一个表达式结果相同，而不是文档上写的“and 仅在所有表达式都返回 true 时返回 true，否则返回 false”）
      // 只好注释掉下面这行，把两个条件拆开，再到 match 里筛选
      // matched: $.and($.gte(['$date', date1]), $.lt(['$date', date2])),

      gte: $.gte(['$date', event.fromDate]),
      lt: $.lt(['$date', event.toDate]),
      amount: '$amount',
    })
    .match({
      gte: true,
      lt: true
    })
    .group({
      _id: null,
      totalAmount: $.sum('$amount')
    })
    .end()
}