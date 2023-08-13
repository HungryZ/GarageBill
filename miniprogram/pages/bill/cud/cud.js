//获取应用实例
const app = getApp()

Page({

  data: {
    itemType: 0, // 0修补单 1采购单
    billModel: {},
    type: 0, // 0创建 1修改
    parameters: [],
  },

  onLoad: function (options) {
    this.data.itemType = options.itemType
    this.configParameters()
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
      url: '../../item/list/list?itemType=' + this.data.itemType + '&isEnterFromCreateBill=true',
    })
  },

  onSave() {
    if (this.checkValid()) {
      if (this.data.billModel.items && this.data.billModel.items.length > 0) {
        if (this.data.type == 0) {
          this.requestCreateBill()
        } else {
          this.requestUpdateBill()
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '项目不能为空'
        })
      }
    }
  },

  onPrint() {
    wx.navigateTo({
      url: '../print/print?bill=' + JSON.stringify(this.data.billModel),
    })
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
        collectionName: this.data.itemType == 0 ? 'repair-bill' : 'purchase-bill',
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
        collectionName: this.data.itemType == 0 ? 'repair-bill' : 'purchase-bill',
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
        collectionName: this.data.itemType == 0 ? 'repair-bill' : 'purchase-bill',
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

    for (let i = 0; i < this.data.parameters.length; i++) {
      let para = this.data.parameters[i]
      if (para.rules) {
        for (let i = 0; i < para.rules.length; i++) {
          let rule = para.rules[i]
          if (!this.verifyFieldWithRule(billModel[para.field], rule.ruleType)) {
            wx.showToast({
              title: rule.message,
              icon: 'none',
            })
            return false
          }
        }
      }
    }

    return true
  },

  verifyFieldWithRule(fieldValue, ruleType) {
    switch (ruleType) {
      case 0: // 必填
        return fieldValue != null && fieldValue.length > 0

      case 1: // 手机格式
        return /^1[3-9]\d{9}$/.test(fieldValue)

      case 2: // 空或者手机格式
        return fieldValue == null || fieldValue.length == 0 || /^1[3-9]\d{9}$/.test(fieldValue)

      default:
        return true
    }
  },

  configParameters() {
    let parameters;
    if (this.data.itemType == 0) {
      parameters = app.billParameters()
    } else {
      parameters = []
    }
    this.setData({
      parameters: parameters
    })
  },
})