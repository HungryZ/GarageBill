//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'develop-akv7w',
        traceUser: true,
      })
    }

    this.globalData = {}
  },

  billParameters() {
    return [{
        name: '车牌号码',
        placeholder: '请输入车牌',
        field: 'plateNumber',
        rules: [{
          ruleType: 0,
          message: '车牌号必填'
        }],
      },
      {
        name: '车辆型号',
        placeholder: '请输入车型',
        field: 'carModel',
        rules: [{
          ruleType: 0,
          message: '车型必填'
        }],
      },
      {
        name: '车主姓名',
        placeholder: '请输入车主',
        field: 'owner'
      },
      {
        name: '车主手机',
        placeholder: '请输入手机',
        field: 'phone',
        rules: [{
          ruleType: 2,
          message: '手机号格式错误'
        }],
      },
      {
        name: '行驶里程',
        placeholder: '请输入里程',
        field: 'mileage',
        rules: [{
          ruleType: 0,
          message: '里程必填'
        }],
      },
      {
        name: '施工人',
        placeholder: '请输入施工人',
        field: 'operator',
        rules: [{
          ruleType: 0,
          message: '施工人必填'
        }],
      },
    ]
  },
})