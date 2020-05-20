// miniprogram/pages/repair/item/search/search.js
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
    console.log("search onUnload")
  },

  completeButtonClicked() {
    wx.navigateBack({
      complete: (res) => {
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 1]; // 执行complete时当前这个页面已经onUnload了
        var prePageItems = prePage.data.items
        prePageItems.push({
          "name": "洗车",
          "amount": 88
        })
        prePage.setData({
          items: prePageItems,
        })
      },
    })
  }
})