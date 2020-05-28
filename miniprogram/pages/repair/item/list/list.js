// miniprogram/pages/repair/item/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEnterFromCreateBill: false,
    inputShowed: false,
    inputVal: "",
    itemList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.isEnterFromCreateBill = options.isEnterFromCreateBill != null;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectItemsByName('')
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
      name: 'regexp-search',
      data: {
        collectionName: 'repair-item',
        field: 'name',
        value: name,
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [regexp-search] 调用成功：', res.result)
        this.setData({
          itemList: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [regexp-search] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },
  
  searchBtnClicked() {
    this.selectItemsByName(this.data.inputVal)
  },

  cellClicked(e) {
    const selectedItem = this.data.itemList[e.currentTarget.id]
    if (this.data.isEnterFromCreateBill) {
      this.popBackWithItem(selectedItem)
    } else {
      // 进入详情页面
      this.pushToDetail(selectedItem)
    }
  },

  popBackWithItem(item) {
    wx.navigateBack({
      complete: (res) => {
        item.count = 1
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 1]; // 执行complete时当前这个页面已经onUnload了
        var prePageItems = prePage.data.items
        prePageItems.push(item)
        prePage.setData({
          items: prePageItems,
        })
        prePage.calculateTotalAmount()
      },
    })
  },

  pushToDetail(item) {
    wx.navigateTo({
      url: '../cud/cud?item=' + JSON.stringify(item),
    })
  }

})