//index.js
const app = getApp()

Page({
  data: {
    menu: [{
        text: '新建修理单',
        url: 'bill/cud/cud?itemType=0'
      },
      {
        text: '新建采购单',
        url: 'bill/cud/cud?itemType=1'
      },
      {
        text: '查询修理单',
        url: 'bill/search/search?itemType=0'
      },
      {
        text: '查询采购单',
        url: 'bill/search/search?itemType=1'
      },
      {
        text: '管理修理项目',
        url: 'item/menu/menu?itemType=0'
      },
      {
        text: '管理采购项目',
        url: 'item/menu/menu?itemType=1'
      },
      {
        text: '账号管理'
      },
      {
        text: 'holder'
      }
    ]
  },

  onLoad: function () {

  }

})