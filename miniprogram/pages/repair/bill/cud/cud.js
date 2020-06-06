Page({

  data: {
    paramaters: [{
        placeholder: '请输入车牌',
        field: 'plateNumber'
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
    billModel: {},
    type: 0,  // 0创建 1修改
  },

  onLoad: function (options) {
    const bill = options.bill ? JSON.parse(options.bill) : null
    this.setData({
      type: bill ? 1 : 0,
      billModel: bill ? bill : {},
    })
  },

  //////////////////////////////////////////// user interaction

  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`billModel.${field}`]: e.detail.value
    })
  },

  addButtonClicked() {
    wx.navigateTo({
      url: '../../item/list/list?isEnterFromCreateBill=true',
    })
  },

  onSave() {
    if (this.checkValid()) {
      if (this.data.type == 0) {
        this.requestCreateBill()
      } else {
        this.requestUpdateBill()
      }
    }
  },

  onItemDelete(e) {
    let index = e.currentTarget.id
    this.data.billModel.items.splice(index, 1)
    this.setData({
      billModel: this.data.billModel
    })
    this.calculateTotalAmount()
  },

  onBillDelete(e) {
    let that = this
    wx.showModal({
      title: '删除确认',
      content: '将要删除该条记录',
      confirmText: "删除",
      confirmColor: "#e64340",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.deleteBill()
        } else {
          console.log('取消')
        }
      }
    });
  },

  countChange(e) {
    let index = e.currentTarget.id
    this.data.billModel.items[index].count = e.detail.value
    this.setData({
      billModel: this.data.billModel
    })
    this.calculateTotalAmount()
  },

  //////////////////////////////////////////// request

  requestCreateBill() {
    wx.showLoading({
      mask: true
    })
    // 因为使用的是微信云后台，数据库是json文件数据库，每个字段的值可以直接保存数组或者json，所以这里偷懒了直接把项目列表的数据保存在了修补单items字段下面，直接把数据存在了一张表里面，没有另外建表再关联id，这样存取方便，缺点是存储的数据变大，item数据不会因为repair-item表的更新而更新。
    this.data.billModel.date = new Date() // 默认格林威治时间(零时区)
    // billModel.billNumber = this.generateBillNumber() // 单号先不做

    wx.cloud.callFunction({
      name: 'add',
      data: {
        collectionName: 'repair-bill',
        data: this.data.billModel
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

  requestUpdateBill() {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collectionName: 'repair-bill',
        _id: this.data.billModel._id,
        data: this.data.billModel
      },
      success: res => {
        console.log('[云函数] [update] 调用成功：', res.result)
        wx.showToast({
          icon: 'success',
          title: '更新成功'
        })
      },
      fail: err => {
        console.error('[云函数] [update] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  deleteBill() {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        collectionName: 'repair-bill',
        _id: this.data.billModel._id
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [remove] 调用成功：', res.result)
        if (res.result.succeed) {
          wx.showToast({
            icon: 'success',
            title: '删除成功',
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 500);
        } else {
          this.setData({
            error: '删除失败'
          })
        }
      },
      fail: err => {
        console.error('[云函数] [remove] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  //////////////////////////////////////////// helper

  calculateTotalAmount() {
    let sum = 0
    this.data.billModel.items.forEach(item => {
      sum += item.price * item.count
    })
    this.setData({
      [`billModel.${'amount'}`]: sum
    })
  },

  checkValid() {
    let billModel = this.data.billModel
    let rules = [{key: 'plateNumber', message: '车牌号必填'}, 
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