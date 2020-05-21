Page({

  data: {
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

  onLoad: function (options) {},

  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (valid) {
        this.requestCreateRepairItem()
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

  requestCreateRepairItem() {
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'create-repair-item',
      data: {
        name: this.data.formData.name,
        price: Number(this.data.formData.price),
      },
      success: res => {
        console.log('[云函数] [create-repait-item] 调用成功：', res.result)
        this.handleResponse(res)
      },
      fail: err => {
        console.error('[云函数] [create-repait-item] 调用失败', err)
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
        title: '新建成功'
      })
      // 清空数据以便再次创建
      this.setData({
        formData: {}
      })
    } else {
      this.setData({
        error: '创建失败，一般原因是项目名重复'
      })
    }
  },
})