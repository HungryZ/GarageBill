//index.js
const app = getApp()
// 上传图片大小限制，单位字节 Byte
const IMAGE_SIZE_LIMIT = 512 * 1024

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

  scanItemClicked() {
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      sizeType: ['compressed'],
      camera: 'back',
      success(res) {
        wx.showLoading({
          title: '车牌识别中',
          mask: true
        })
        that.data.compressStartTime = wx.getPerformance().now()
        that.handleImage(res.tempFiles[0], (succeed, imageBase64) => {
          that.data.log += 'handleImage done cost:' + (wx.getPerformance().now() - that.data.compressStartTime).toFixed(0) + 'ms' + ' |\n'
          console.log('handleImage done cost:' + (wx.getPerformance().now() - that.data.compressStartTime).toFixed(0) + 'ms' + ' |\n')
          if (succeed) {
            let imageBase64Full = 'data:image/jpeg;base64,' + imageBase64
            that.requestOCR(imageBase64Full)
          } else {
            that.uploadLog()
          }
        })
      },
      fail(err) {
        that.data.log += 'chooseMedia fail:' + JSON.stringify(err) + ' |\n'
        console.log('chooseMedia fail:' + JSON.stringify(err))
        wx.showToast({
          icon: 'none',
          title: '拍照失败'
        })
      },
    })
  },

  handleImage(tempFile, complete) {
    this.data.log = ''
    this.data.log += 'IMAGE_SIZE_LIMIT:' + (IMAGE_SIZE_LIMIT / 1024).toFixed(0) + 'KB' + ' |\n'
    this.data.log += 'origin image size:' + (tempFile.size / 1024).toFixed(0) + 'KB' + ' |\n'
    console.log('origin image size:' + (tempFile.size / 1024).toFixed(0) + 'KB')
    if (tempFile.size <= IMAGE_SIZE_LIMIT) {
      this.data.log += 'origin image size ok |\n'
      console.log('origin image size ok')
      wx.getFileSystemManager().readFile({
        filePath: tempFile.tempFilePath,
        encoding: 'base64',
        success(res) {
          complete(true, res.data)
        },
        fail(err) {
          complete(false)
        }
      })
    } else {
      this.data.log += 'origin image need compress |\n'
      console.log('origin image need compress')
      this.compressImageByWX(IMAGE_SIZE_LIMIT, tempFile.tempFilePath, complete)
    }
  },

  compressImageByWX(sizeLimit, filePath, complete, times = 0) {
    let that = this
    this.data.log += 'compressImageByWX start times:' + times + ' |\n'
    console.log('compressImageByWX start times:' + times)
    wx.compressImage({
      src: filePath,
      quality: 35,
      compressedWidth: 500, // px
      success(compRes) {
        wx.getFileSystemManager().readFile({
          filePath: compRes.tempFilePath,
          encoding: 'base64',
          success(res) {
            var compressedImageSize = (res.data.length - (res.data.length / 8) * 2).toFixed(3);
            that.data.log += 'compressedImageSize:' + (compressedImageSize / 1024).toFixed(0) + 'KB' + ', times:' + times + ' |\n'
            console.log('compressedImageSize:' + (compressedImageSize / 1024).toFixed(0) + 'KB' + ', times:' + times)
            if (compressedImageSize <= sizeLimit) {
              that.data.log += 'compress done times:' + times + ' |\n'
              console.log('compress done times:' + times)
              complete(true, res.data)
            } else if (times < 1) {
              that.data.log += 'compress again times:' + times + ' |\n'
              console.log('compress again times:' + times)
              that.compressImageByWX(sizeLimit, compRes.tempFilePath, complete, times + 1)
            } else {
              that.data.log += 'start convas redraw times:' + times + ' |\n'
              console.log('start convas redraw times:' + times)
              that.redrawImageByCanvas(sizeLimit, compRes.tempFilePath, complete)
            }
          },
          fail(err) {
            that.data.log += 'compressImageByWX readFile fail:' + JSON.stringify(err) + ' |\n'
            console.log('compressImageByWX readFile fail:' + JSON.stringify(err))
            wx.showToast({
              icon: 'none',
              title: '解码失败'
            })
            complete(false)
          },
        })
      },
      fail(err) {
        that.data.log += 'compressImageByWX compressImage fail:' + JSON.stringify(err) + ' |\n'
        console.log('compressImageByWX compressImage fail:' + JSON.stringify(err))
        wx.showToast({
          icon: 'none',
          title: '压缩失败'
        })
        complete(false)
      },
    })
  },

  redrawImageByCanvas(sizeLimit, tempFilePath, complete) {
    this.data.log += 'redrawImageByCanvas start |\n'
    console.log('redrawImageByCanvas start')
    let that = this;
    wx.getImageInfo({
      src: tempFilePath,
      success(imgres) {
        let ratio = imgres.width / imgres.height
        // width * (width / ratio) * 4 = sizeLimit * 16 // 乘16是因为JPEG格式会压缩，压缩比例不固定，这里假设1:16
        let drawWidth = Math.sqrt(sizeLimit * 16 * ratio / 4).toFixed(2)
        let drawHeight = (drawWidth / ratio).toFixed(2)
        that.setData({
          drawWidth: imgres.width,
          drawHeight: imgres.height,
        })
        that.data.log += 'redrawImageByCanvas ' + "originImgwidth:" + imgres.width + ", originImgheight:" + imgres.height + ", ratio:" + ratio + ", drawWidth:" + drawWidth + ", drawHeight:" + drawHeight + ' |\n'
        console.log('redrawImageByCanvas ' + "originImgwidth:" + imgres.width + ", originImgheight:" + imgres.height + ", ratio:" + ratio + ", drawWidth:" + drawWidth + ", drawHeight:" + drawHeight)
        
        const ctx = wx.createCanvasContext('attendCanvasId'); //canvas id
        ctx.drawImage(tempFilePath, 0, 0, imgres.width, imgres.height);
        ctx.draw(false, function () {
          wx.canvasToTempFilePath({
            canvasId: 'attendCanvasId',
            destWidth: drawWidth,
            destHeight: drawHeight,
            fileType: 'jpg', //目标文件的类型，这里可以根据实际情况来，
            quality: 0.8, //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
            success(s) {
              wx.getFileSystemManager().readFile({
                filePath: s.tempFilePath,
                encoding: 'base64',
                success(res) {
                  var imageSize = ((res.data.length - (res.data.length / 8) * 2) / 1024).toFixed(3);
                  that.data.log += 'redrawImageByCanvas done size:' + imageSize + 'KB' + ' |\n'
                  console.log('redrawImageByCanvas done size:' + imageSize + 'KB')
                  complete(true, res.data)
                },
                fail(err) {
                  wx.showToast({
                    icon: 'none',
                    title: '解码失败'
                  })
                  complete(false)
                },
              })
            },
            fail(err) {
              complete(false)
            }
          });
        });
      }
    })
  },

  requestOCR(imageBase64) {
    this.data.OCRStartTime = wx.getPerformance().now()
    this.data.log += 'requestOCR start' + ' |\n'
    console.log('requestOCR start')
    let that = this
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
        console.log(res)
        wx.hideLoading()
        if (res.data.number) {
          that.data.log += 'requestOCR success:' + JSON.stringify(res.data) + ' |\n'
          console.log('requestOCR success:' + JSON.stringify(res.data))
          let nowTime = wx.getPerformance().now()
          that.data.log += 'requestOCR done cost:' + (nowTime - that.data.OCRStartTime).toFixed(0) + ' |\n'
          console.log('requestOCR done cost:' + (nowTime - that.data.OCRStartTime).toFixed(0))
          that.data.log += 'OCR Flow done total cost:' + (nowTime - that.data.compressStartTime).toFixed(0) + ' |\n'
          console.log('OCR Flow done total cost:' + (nowTime - that.data.compressStartTime).toFixed(0))
          wx.navigateTo({
            url: '../bill/search/search?itemType=0&selectedTypeIndex=0&inputVal=' + res.data.number,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '识别失败'
          })
          that.data.log += 'requestOCR fail: request succeed but no number' + ' |\n'
          console.log('requestOCR fail: request succeed but no number')
        }
        that.uploadLog()
      },
      fail(error) {
        wx.showToast({
          icon: 'none',
          title: '识别失败'
        })
        that.data.log += 'requestOCR fail:' + JSON.stringify(error) + ' |\n'
        console.log('requestOCR fail:' + JSON.stringify(error))
        that.uploadLog()
      },
    })
  },

  uploadLog() {
    wx.cloud.callFunction({
      name: 'add',
      data: {
        collectionName: 'log',
        data: {
          date: new Date(),
          log: this.data.log
        }
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
})