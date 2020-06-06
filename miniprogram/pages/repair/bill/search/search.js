Page({

  data: {
    selectedTypeIndex: 0,
    typeArray: ['车牌号', '车型', '车主姓名', '车主手机号'],
    typeField: ['plateNumber', 'carModel', 'owner', 'phone'],
    inputShowed: false,
    inputVal: "",
    billList: []
  },

  onLoad: function (options) {

  },

  onShow: function () {

  },

  inputting: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  selectBillsByPara(para) {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'regexp-search',
      data: {
        collectionName: 'repair-bill',
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
  
  searchBtnClicked() {
    if (this.data.inputVal.length == 0) {
      return
    }
    this.selectBillsByPara({
      field: this.data.typeField[this.data.selectedTypeIndex],
      value: this.data.inputVal
    })    
  },

  cellClicked(e) {
    const selectedBill = this.data.billList[e.currentTarget.id]
    this.pushToDetail(selectedBill)
  },

  pushToDetail(bill) {
    wx.navigateTo({
      url: '../cud/cud?bill=' + JSON.stringify(bill),
    })
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