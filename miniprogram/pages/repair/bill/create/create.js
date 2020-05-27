// miniprogram/pages/repair/bill/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paramaters: [{
        "name": "请输入车牌"
      },
      {
        "name": "请输入车型"
      },
      {
        "name": "请输入车主"
      },
      {
        "name": "请输入手机"
      },
      {
        "name": "请输入里程"
      },
    ],
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log(this.data.items)
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

  addButtonClicked() {
    wx.navigateTo({
      url: '../../item/list/list?isEnterFromCreateBill=true',
    })
  }
})