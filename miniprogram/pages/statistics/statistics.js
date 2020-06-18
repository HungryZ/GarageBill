// miniprogram/pages/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statisticList: [],
    dateString: '未选择',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindDateChange(e) {
    this.setData({
      dateString: e.detail.value
    })
    let array = e.detail.value.split('-')
    this.requestTotalForYearAndMonth(Number(array[0]), Number(array[1]))
  },

  requestTotalForYearAndMonth(year, month) {
    wx.showLoading({
      mask: true
    })
    // 承载所有操作的 promise 的数组
    let tasks = []
    this.loadTaskForCollection(tasks, 'repair-bill', year, month)
    this.loadTaskForCollection(tasks, 'purchase-bill', year, month)
    // 等待执行所有
    Promise.all(tasks).then((values) => {
      wx.hideLoading()
      // console.log(values);
      let list = []
      values.forEach(total => {
        if (total.result.list.length > 0) {
          list.push(total.result.list[0].totalAmount)
        } else {
          list.push(0)
        }
      });
      // list的前面一半是收入，后面一半是支出，处理一下，算出收益
      let statisticList = []
      for (let i = 0; i < list.length / 2; i++) {
        statisticList.push({
          income: list[i],
          expenditure: list[i + list.length / 2],
          profit: list[i] - list[i + list.length / 2],
        })
      }
      this.setData({
        statisticList: statisticList
      })
    });
  },

  loadTaskForCollection(tasks, collectionName, year, month) {
    let daysCount = this.daysCountInYearAndMonth(year, month)
    for (let i = 0; i < daysCount; i++) {
      let dateString = year + '-' + month + '-' + (i + 1);
      let fromDateString = dateString + ' 00:00:00 GMT +8'
      let toDateString = dateString + ' 23:59:59 GMT +8'
      const promise = wx.cloud.callFunction({
        name: 'period-amount',
        data: {
          collectionName: collectionName,
          fromDate: new Date(fromDateString),
          toDate: new Date(toDateString)
        }
      })
      tasks.push(promise)
    }
  },

  daysCountInYearAndMonth(year, month) {
    switch (month) {
      case 1:
        return 31
      case 2:
        return this.isLeapYear(year) ? 29 : 28
      case 3:
        return 31
      case 4:
        return 30
      case 5:
        return 31
      case 6:
        return 30
      case 7:
        return 31
      case 8:
        return 31
      case 9:
        return 30
      case 10:
        return 31
      case 11:
        return 30
      case 12:
        return 31
    }
  },

  isLeapYear(year) {
    return year % 400 == 0 || (year % 4 == 0 && (year % 100 != 0))
  }
})