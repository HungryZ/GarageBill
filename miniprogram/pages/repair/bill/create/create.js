Page({

  data: {
    paramaters: [{
        placeholder: '请输入车牌',
        field: 'platenumber'
      },
      {
        placeholder: '请输入车型',
        field: 'model'
      },
      {
        placeholder: '请输入车主',
        field: 'owner'
      },
      {
        placeholder: '请输入手机',
        field: 'phone'
      },
      {
        placeholder: '请输入里程',
        field: 'mileage'
      },
    ],
    formData: {},
    items: [],
    totalAmount: 0,
  },

  onLoad: function (options) {

  },

  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
    console.log(this.data.formData)
  },

  addButtonClicked() {
    wx.navigateTo({
      url: '../../item/list/list?isEnterFromCreateBill=true',
    })
  },

  onSave() {
    if (this.checkValid()) {
      this.requestCreateBill()
    }
  },

  onDelete() {

  },

  requestCreateBill() {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'add',
      data: {
        collectionName: 'repair-bill',
        data: this.data.formData
      },
      success: res => {
        console.log('[云函数] [add] 调用成功：', res.result)
        console.log(res.result._id)
        console.log(this.data.items)
      },
      fail: err => {
        console.error('[云函数] [add] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },



  calculateTotalAmount() {
    let sum = 0
    this.data.items.forEach(item => {
      sum += item.price * item.count
    })
    this.setData({
      totalAmount: sum
    })
  },

  checkValid() {
    let billModel = this.data.formData
    let rules = [{key: 'platenumber', message: '车牌号必填'}, 
                 {key: 'model', message: '车型必填'}, 
                 {key: 'mileage', message: '里程数必填'}]
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let value = billModel[rule.key]
      if (value == null || value.length == 0) {
        wx.showToast({
          title: rule.message,
          icon: 'none',
        })
        return false
      }
    }

    if (billModel.phone && billModel.phone.length > 0) {
      var reg = /^1[3-9]\d{9}$/
      if (!reg.test(billModel.phone)) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'none',
        })
        return false
      }
    }

    return true
  },
})