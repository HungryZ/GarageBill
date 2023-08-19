// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

/*
入参
collectionName
year
month
hideEmptyDays 隐藏数据为0的天
*/
// 云函数入口函数
exports.main = async (event, context) => {
  const boundaries = this.generateBoundaries(event.year, event.month)
  let fromDate = new Date(event.year, event.month - 1, 1)
  let toDate = new Date(event.year, event.month, 1)
  let result = await db
    .collection(event.collectionName)
    .aggregate()
    // 直接使用 match 查询 date 无效，应该是bug，所以这里先加字段，然后筛选
    // .match({
    //   date: _.and(_gte(fromDate), _.lt(toDate))
    // })
    .project({
      date: 1,
      amount: 1,
      matched: $.and($.gte(['$date', fromDate]), $.lt(['$date', toDate])),
    })
    .match({
      matched: true
    })
    .bucket({
      groupBy: '$date',
      boundaries: boundaries,
      default: 'other',
      output: {
        totalAmount: $.sum('$amount'),
        count: $.sum(1),
        ids: $.push('$_id')
      }
    })
    .end()

  var resultList = result.list

  // 补全数据为0的天
  if (!event.hideEmptyDays) {
    var filledResultList = []
    boundaries.forEach(boundary => {
      var dayAmount
      result.list.forEach(item => {
        if (new Date(item._id).valueOf() === boundary.valueOf()) {
          dayAmount = item
          // forEach 如何结束？
        }
      })
      if (!dayAmount) {
        dayAmount = {
          _id: boundary,
          totalAmount: 0,
          count: 0,
          ids: []
        }
      }
      filledResultList.push(dayAmount)
    })
    resultList = filledResultList
  }

  return resultList
}

exports.generateBoundaries = (year, month) => {
  var boundaries = []
  let daysCount = this.daysCount(year, month)
  for (let i = 0; i < daysCount; i++) {
    boundaries.push(new Date(year, month - 1, i + 1))
  }
  return boundaries
}

exports.daysCount = (year, month) => {
  /*
    yyyy:四位数表示的年份
    M:用整数表示月份，从0(1月)到11(12月）
    d:表示一个月中的第几天，从1到31

    这里 month 是从0开始的，所以 new Date(year, month, 0) 表示下个月0号，即当月的最后一天
  */
  return new Date(year, month, 0).getDate()
}