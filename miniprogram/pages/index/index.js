//index.js
const app = getApp()

Page({
  data: {
    menu: [{
        icon: '../../images/BusinessIcons_BankMoney.png',
        text: '新建维修单',
        url: 'bill/cud/cud?itemType=0'
      },
      {
        icon: '../../images/BusinessIcons_BlankMonitor.png',
        text: '新建采购单',
        url: 'bill/cud/cud?itemType=1'
      },
      {
        icon: '../../images/BusinessIcons_DollarCoin.png',
        text: '查询维修单',
        url: 'bill/search/search?itemType=0'
      },
      {
        icon: '../../images/BusinessIcons_GoldMoney.png',
        text: '查询采购单',
        url: 'bill/search/search?itemType=1'
      },
      {
        icon: '../../images/BusinessIcons_PoundMoneyDeal.png',
        text: '管理修理项目',
        url: 'item/menu/menu?itemType=0'
      },
      {
        icon: '../../images/BusinessIcons_SafeMoney.png',
        text: '管理采购项目',
        url: 'item/menu/menu?itemType=1'
      },
      {
        icon: '../../images/BusinessIcons_ShareMoney.png',
        text: '统计',
        url: 'statistics/statistics'
      },
      {
        icon: '../../images/BusinessIcons_WalletMoney-.png',
        text: '扫一扫',
        url: 'scan/scan'
      },
      {
        icon: '../../images/BusinessIcons_YenMoneyDeal.png',
        text: '账号管理'
      },
    ]
  },

  onLoad: function () {

  },


  cameraButtonClicked() {
    wx.showLoading({
      title: '车牌识别中',
      mask: true
    })
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      sizeType: ['compressed'],
      camera: 'back',
      success(res) {
        let fileSizeInKB = res.tempFiles[0].size / 1000
        console.log('fileSizeInKB: ' + fileSizeInKB)
        let quality = parseInt(200.0 / fileSizeInKB * 100)
        console.log('quality: ' + quality)
        wx.compressImage({
          src: res.tempFiles[0].tempFilePath,
          quality: quality,
          compressedWidth: 100, // px
          success(res) {
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath,
              encoding: 'base64',
              success(res) {
                let imageBase64 = 'data:image/jpeg;base64,' + res.data
                that.requestOCR(imageBase64)
              },
              fail(err) {
                wx.showToast({
                  icon: 'none',
                  title: '解码失败'
                })
              },
            })
          },
          fail(err) {
            wx.showToast({
              icon: 'none',
              title: '压缩失败'
            })
          },
        })
      },
      fail(err) {
        wx.showToast({
          icon: 'none',
          title: '拍照失败'
        })
      },
    })
  },

  requestOCR(imageBase64) {
    wx.request({
      url: 'https://klogan.cn/zhc/ocr/vehicleLicense',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        'imageBase64': imageBase64,
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        wx.navigateTo({
          url: '../bill/search/search?itemType=0&selectedTypeIndex=0&inputVal=' + res.data.number,
        })
      },
      fail(error) {
        console.log(error)
        wx.showToast({
          icon: 'none',
          title: '识别失败'
        })
      },
    })
  },
})