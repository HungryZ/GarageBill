// miniprogram/pages/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let dateString = '2020-06-11'
    // let fromDateString = dateString + ' 00:00:00 GMT +8'
    // let toDateString = dateString + ' 23:59:59 GMT +8'
    // wx.cloud.callFunction({
    //   name: 'profit-in-month',
    //   data: {
    //     fromDate: new Date(fromDateString),
    //     toDate: new Date(toDateString),
    //   },
    //   success: res => {
    //     console.log('[云函数] [add_array] 调用成功：', res.result)
    //   },
    //   fail: err => {
    //     console.error('[云函数] [add_array] 调用失败', err)
    //   }
    // })

    // 承载所有操作的 promise 的数组
    let tasks = []
    let year = '2020', month = '6'
    for (let i = 1; i < 30; i++) {
      let dateString = year + '-' + month + '-' + i;
      let fromDateString = dateString + ' 00:00:00 GMT +8'
      let toDateString = dateString + ' 23:59:59 GMT +8'
      const promise = wx.cloud.callFunction({
        name: 'period-amount',
        data: {
          fromDate: new Date(fromDateString),
          toDate: new Date(toDateString)
        }
      })
      tasks.push(promise)
    }
    // 等待执行所有
    Promise.all(tasks).then((values) => {
      console.log(values[10].result.list[0].totalAmount);
    });

    // console.log(results)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})