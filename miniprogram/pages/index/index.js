//index.js
const app = getApp()

Page({
  data: {
    menu: [{
        text: '新建修理单',
        url: 'repair/bill/cud/cud'
      },
      {
        text: '查询修理单',
        url: 'repair/bill/search/search'
      },
      {
        text: '新建采购单'
      },
      {
        text: '查询采购单'
      },
      {
        text: '修理项目管理',
        url: 'repair/item/menu/menu'
      },
      {
        text: '采购项目管理'
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