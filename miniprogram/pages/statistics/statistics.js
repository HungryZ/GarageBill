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
  onLoad: function (options) {},

  bindDateChange(e) {
    this.setData({
      dateString: e.detail.value
    })
    let array = e.detail.value.split('-')
    this.requestTotalAmountOfMonth(Number(array[0]), Number(array[1]))
  },

  requestTotalAmountOfMonth(year, month) {
    wx.cloud.callFunction({
      name: 'period-amount',
      data: {
        collectionName: 'repair-bill',
        year: year,
        month: month,
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [period-amount] 调用成功：', res.result)
        this.setData({
          statisticList: res.result
        })
      },
      fail: err => {
        console.error('[云函数] [period-amount] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },
})