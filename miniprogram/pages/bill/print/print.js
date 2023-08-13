//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameters:[],
    bill: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bill = JSON.parse(options.bill)
    bill.items.forEach(item => {
      // 后面把类型统一为int
      item.count = parseInt(item.count)
    })
    this.setData({
      parameters: app.billParameters(),
      bill: bill
    })
    console.log(this.data.bill)
  },
})