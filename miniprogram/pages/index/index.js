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

  }

})