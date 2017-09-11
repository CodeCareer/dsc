export default {
  path: 'analyze',
  name: 'analyze',
  redirect: { name: 'AssetAnalyze' },
  component: {
    render(h) {
      return h('router-view')
    }
  },
  meta: {
    permit: ['productsRelease', 'productsAudit'],
    menu: {
      name: '统计分析',
      icon: 'icon-analyze'
    }
  },
  children: [{
    path: 'asset_analyze',
    name: 'AssetAnalyze',
    component: resolve => require(['@/views/analyze/AssetAnalyze.vue'], resolve),
    meta: {
      title: '车DAS系统-资产分析',
      // permit: ['ageAnalyze', 'carAnalyze', 'cityAnalyze', 'payAnalyze', 'assetAnalyze'],
      permit: ['productsRelease'],
      menu: {
        name: '资产分析'
      },
      crumbs: [{
        name: '统计分析',
        to: { name: 'AssetAnalyze' }
      }, {
        name: '资产分析',
        to: { name: 'AssetAnalyze' }
      }]
    }
  }, {
    path: 'risk_analyze',
    name: 'RiskAnalyze',
    component: resolve => require(['@/views/analyze/RiskAnalyze.vue'], resolve),
    meta: {
      title: '车DAS系统-风险分析',
      permit: ['productsRelease', 'productsAudit'],
      menu: {
        name: '逾期分析'
      },
      crumbs: [{
        name: '统计分析',
        to: { name: 'AssetAnalyze' }
      }, {
        name: '逾期分析',
        to: { name: 'RiskAnalyze' }
      }]
    }
  }]
}
