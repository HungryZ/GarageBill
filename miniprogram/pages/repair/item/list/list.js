// miniprogram/pages/repair/item/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    itemList: [{
      name: '换轱辘',
      price: '100'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.selectItemsByName('1234')
  },

  inputting: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
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
  },

  selectItemsByName(name) {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'select-repair-item',
      data: {
        name: name,
      },
      success: res => {
        console.log('[云函数] [select-repait-item] 调用成功：', res.result)
      },
      fail: err => {
        console.error('[云函数] [select-repait-item] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },
  
  searchBtnClicked() {
    console.log(this.data.inputVal)
  }
})