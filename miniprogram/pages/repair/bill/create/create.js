Page({

  data: {
    paramaters: [{
        placeholder: '请输入车牌',
        field: 'platenumber'
      },
      {
        placeholder: '请输入车型',
        field: 'carModel'
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

  onDelete(e) {
    let index = e.currentTarget.id
    this.data.items.splice(index, 1)
    this.setData({
      items: this.data.items
    })
    this.calculateTotalAmount()
  },

  countChange(e) {
    let index = e.currentTarget.id
    this.data.items[index].count = e.detail.value
    this.setData({
      items: this.data.items
    })
    this.calculateTotalAmount()
  },

  requestCreateBill() {
    wx.showLoading({
      mask: true
    })
    // 因为使用的是微信云后台，数据库是json文件数据库，每个字段的值可以直接保存数组或者json，所以这里偷懒了直接把项目列表的数据保存在了修补单items字段下面，直接把数据存在了一张表里面，没有另外建表再关联id，这样存取方便，缺点是存储的数据变大，item数据不会因为repair-item表的更新而更新。
    let billModel = this.data.formData
    billModel.items = this.data.items
    billModel.amount = this.data.totalAmount
    billModel.date = new Date() // 默认格林威治时间(零时区)
    // billModel.billNumber = this.generateBillNumber() // 先不做

    wx.cloud.callFunction({
      name: 'add',
      data: {
        collectionName: 'repair-bill',
        data: billModel
      },
      success: res => {
        console.log('[云函数] [add] 调用成功：', res.result)
        wx.showToast({
          icon: 'success',
          title: '创建成功',
        })
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

  dateToString() {
    let nowDate = new Date()
    var month = (Array(2).join('0') + (nowDate.getMonth() + 1)).slice(-2)
    var day = (Array(2).join('0') + nowDate.getDate()).slice(-2)
    return nowDate.getFullYear() + '-' + month + '-' + day + ' GMT +8';
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
                 {key: 'carModel', message: '车型必填'}, 
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