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
    permit: ['ageAnalyze', 'carAnalyze', 'cityAnalyze', 'payAnalyze', 'assetAnalyze', 'riskOverdue', 'riskMigrateRate', 'riskVintage'],
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
      permit: ['ageAnalyze', 'carAnalyze', 'cityAnalyze', 'payAnalyze', 'assetAnalyze'],
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
      permit: ['riskOverdue', 'riskMigrateRate', 'riskVintage'],
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
