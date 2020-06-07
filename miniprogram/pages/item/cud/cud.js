Page({

  data: {
    itemType: 0,  // 0修补单 1采购单
    type: 0,      // 0新建 1编辑
    title: '新建修补项目',
    item: null,
    formData: {},
    rules: [{
        name: 'name',
        rules: {
          required: true,
          message: '名称必填'
        },
      },
      {
        name: 'price',
        rules: {
          validator: function (rule, value, param, modeels) {
            if (!value) {
              return '价格必填'
            }
            var reg = /^[0-9]+.?[0-9]*$/
            if (!reg.test(value)) {
              return '价格必须为纯数字，单位元'
            }
          }
        }
      }
    ],
  },

  onLoad: function (options) {
    this.data.itemType = options.itemType
    console.log(this.data.itemType)
    const isEdit = options.item != null
    this.setData({
      type: isEdit ? 1 : 0,
      title: isEdit ? '编辑项目' : '新建项目',
      item: isEdit ? JSON.parse(options.item) : null,
    })
    if (isEdit) {
      this.setData({
        'formData.name': this.data.item.name,
        'formData.price': this.data.item.price,
      })
    }
  },

  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  submitItem() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (valid) {
        this.data.type == 0 ? this.requestCreateRepairItem() : this.requestUpdateItem()
      } else {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      }
    })
  },

  deleteItem() {
    this.requestRemoveItem()
  },

  requestCreateRepairItem() {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'add',
      data: {
        collectionName: this.data.itemType == 0 ? 'repair-item' : 'purchase-item',
        data: {
          name: this.data.formData.name,
          price: Number(this.data.formData.price),
        }
      },
      success: res => {
        console.log('[云函数] [add] 调用成功：', res.result)
        this.handleResponse(res)
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

  requestUpdateItem() {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collectionName: this.data.itemType == 0 ? 'repair-item' : 'purchase-item',
        _id: this.data.item._id,
        data: {
          name: this.data.formData.name,
          price: Number(this.data.formData.price),
        }
      },
      success: res => {
        console.log('[云函数] [update] 调用成功：', res.result)
        this.handleResponse(res)
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

  requestRemoveItem() {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        collectionName: this.data.itemType == 0 ? 'repair-item' : 'purchase-item',
        _id: this.data.item._id
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

  handleResponse(res) {
    wx.hideLoading()
    if (res.result.succeed) {
      wx.showToast({
        icon: 'success',
        title: '成功'
      })
      if (this.data.type == 0) {
        // 清空数据以便再次创建
        this.setData({
          formData: {}
        })
      }
    } else {
      this.setData({
        error: '操作失败，一般原因是项目名重复'
      })
    }
  },
})