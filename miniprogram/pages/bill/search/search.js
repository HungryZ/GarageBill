Page({

  data: {
    itemType: 0, // 0修补单 1采购单
    selectedTypeIndex: 0,
    typeArray: [],
    typeField: [],
    inputShowed: false,
    inputVal: "",
    billList: []
  },

  onLoad: function (options) {
    if (this.data.itemType == 0) {
      this.setData({
        typeArray: ['车牌号', '车型', '车主姓名', '车主手机号'],
        typeField: ['plateNumber', 'carModel', 'owner', 'phone'],
        itemType: options.itemType
      })
    } else {
      this.setData({
        typeArray: ['全部'],
        typeField: [''],
        itemType: options.itemType
      })
    }
  },

  onShow: function () {

  },

  inputting: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  searchBtnClicked() {
    // if (this.data.inputVal.length == 0) {
    //   return
    // }
    this.selectBillsByPara({
      field: this.data.typeField[this.data.selectedTypeIndex],
      value: this.data.inputVal
    })
  },

  cellClicked(e) {
    const selectedBill = this.data.billList[e.currentTarget.id]
    this.pushToDetail(selectedBill)
  },

  searchTypeClicked() {
    var that = this
    wx.showActionSheet({
      itemList: that.data.typeArray,
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          that.setData({
            selectedTypeIndex: res.tapIndex,
          })
        }
      }
    });
  },

  selectBillsByPara(para) {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'regexp-search',
      data: {
        collectionName: this.data.itemType == 0 ? 'repair-bill' : 'purchase-bill',
        field: para.field,
        value: para.value,
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [regexp-search] 调用成功：', res.result)
        this.setData({
          billList: res.result.data
        })
        this.configBillDate()
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

  pushToDetail(bill) {
    wx.navigateTo({
      url: '../cud/cud?itemType=' + this.data.itemType + '&bill=' + JSON.stringify(bill),
    })
  },

  configBillDate() {
    this.data.billList.forEach(bill => {
      bill.dateString = this.dateToString(bill.date)
    })
    this.setData({
      billList: this.data.billList
    })
  },

  dateToString(date) {
    let realDate = new Date(date)
    let month = (Array(2).join('0') + (realDate.getMonth() + 1)).slice(-2)
    let day = (Array(2).join('0') + realDate.getDate()).slice(-2)
    return realDate.getFullYear() + '-' + month + '-' + day
  },
})