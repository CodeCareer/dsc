<template lang="pug">
.asset-info-form
  .box
    .box-header
      | 资产基础信息
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 支付宝账号：
                  td {{assetBaseInfo.alipayAccount}}
                tr
                  th 支付宝用户ID：
                  td {{assetBaseInfo.alipayUserId}}
                tr
                  th 年纪：
                  td {{assetBaseInfo.age}}
                tr
                  th 资产来源：
                  td {{assetBaseInfo.assetFrom | statusFormat}}
                tr
                  th 资产来源明细：
                  td {{assetBaseInfo.assetFromDetail | statusFormat}}
                tr
                  th 资产状态：
                  td {{assetBaseInfo.assetStatus | statusFormat}}
                tr
                  th 产品代码：
                  td {{assetBaseInfo.productCode}}
            el-col(:span="8")
              table
                tr
                  th 回购状态：
                  td {{assetBaseInfo.buyBackStatus | statusFormat}}
                tr
                  th 身份证反面照片路径：
                  td {{assetBaseInfo.certBackPicPath}}
                tr
                  th 身份证正面照片路径：
                  td {{assetBaseInfo.certFrontPicPath}}
                tr
                  th 证件号码：
                  td {{assetBaseInfo.certNo}}
                tr
                  th 证件类型：
                  td {{assetBaseInfo.certType}}
                tr
                  th 合同协议路径：
                  td {{assetBaseInfo.contractFilesPath}}
                tr
                  th 推送状态：
                  td {{assetBaseInfo.pushStatus | statusFormat}}
            el-col(:span="8")
              table        
                tr
                  th 融资租赁协议编号：
                  td {{assetBaseInfo.contractNo}}
                tr
                  th uuid：
                  td {{assetBaseInfo.id}}
                tr
                  th 姓名：
                  td {{assetBaseInfo.name}}
                tr
                  th 下单时间戳：
                  td {{assetBaseInfo.orderDateTime | moment('YYYY-MM-DD')}}
                tr
                  th 外部资产订单编号：
                  td {{assetBaseInfo.outerAssetOrderNo}}
                tr
                  th 电话号码：
                  td  {{assetBaseInfo.phoneNum}}

  .box.mt20
    .box-header
      | 资产车贷备用信息
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 资产ID：
                  td {{assetCarBackUpInfo.assetId}}
                tr
                  th 车辆行驶证路径：
                  td {{assetCarBackUpInfo.carDrivingPermitCertPath}}
                tr
                  th 车辆登记证路径：
                  td {{assetCarBackUpInfo.carRegisterCertPath}}
                tr
                  th 驾驶证照片路径：
                  td {{assetCarBackUpInfo.drivingLicencePicPath}}
            el-col(:span="8")
              table
                tr
                  th GPS费用：
                  td {{assetCarBackUpInfo.gpsFee | ktCurrency}}
                tr
                  th uuid：
                  td {{assetCarBackUpInfo.id}}
                tr
                  th 上牌费：
                  td {{assetCarBackUpInfo.licenseFee | ktCurrency}}
                tr
                  th 市场参考价：
                  td {{assetCarBackUpInfo.marketPrice | ktCurrency}}
            el-col(:span="8")
              table        
                tr
                  th 提车确认单文件路径：
                  td {{assetCarBackUpInfo.pickUpFilePath}}
                tr
                  th 购置税：
                  td {{assetCarBackUpInfo.purchasTax | ktCurrency}}
                tr
                  th 采购基准价：
                  td {{assetCarBackUpInfo.purchasePrice | ktCurrency}}
                tr
                  th 二手车处置费：
                  td {{assetCarBackUpInfo.secondHandHandleFee | ktCurrency}}

  .box.mt20
    .box-header
      | 资产核心车贷信息
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 资产ID：
                  td {{assetCarCoreInfo.assetId}}
                tr
                  th 品牌名称：
                  td {{assetCarCoreInfo.brandName}}
                tr
                  th 城市：
                  td {{assetCarCoreInfo.city}}
                tr
                  th 首付金额：
                  td {{assetCarCoreInfo.downPaymentsAmount | ktCurrency}}
                tr
                  th 首付支付流水号：
                  td {{assetCarCoreInfo.downPaymentsPayNo}}
                tr
                  th 首付支付方式：
                  td {{assetCarCoreInfo.downPaymentsPayType | statusFormat}}
                tr
                  th 首付比例：
                  td {{assetCarCoreInfo.downPaymentsPercent | ktPercent}}
                tr
                  th 实际尾款金额：
                  td {{assetCarCoreInfo.factRestAmount | ktCurrency}}
                tr
                  th 无源GPS代码：
                  td {{assetCarCoreInfo.gpsNonSourceCode}}
                tr
                  th 无源GPS供应商名称：
                  td {{assetCarCoreInfo.gpsNonSourceOrgName}}
                tr
                  th 有源GPS供应商名称：
                  td {{assetCarCoreInfo.gpsSourceOrgName}}
                tr
                  th 有源GPS代码：
                  td {{assetCarCoreInfo.gpsSoureCode}}
            el-col(:span="8")
              table
                tr
                  th 厂商指导价：
                  td {{assetCarCoreInfo.guidePrice | ktCurrency}}
                tr
                  th uuid：
                  td {{assetCarCoreInfo.id}}
                tr
                  th 月供金额：
                  td {{assetCarCoreInfo.instalmentAmount | ktCurrency}}
                tr
                  th 保险费用：
                  td {{assetCarCoreInfo.insuranceFee | ktCurrency}}
                tr
                  th 车型：
                  td {{assetCarCoreInfo.modelName}}
                tr
                  th 名义月供金额：
                  td {{assetCarCoreInfo.nameInstalmentsAmount | ktCurrency}}
                tr
                  th 外部系统车型的编码：
                  td {{assetCarCoreInfo.outerCarTypeCode}}
                tr
                  th 提车日期：
                  td {{assetCarCoreInfo.pickUpDate | moment('YYYY-MM-DD')}}
                tr
                  th 车牌号：
                  td {{assetCarCoreInfo.plateNumber}}
                tr
                  th 省份：
                  td {{assetCarCoreInfo.province}}
                tr
                  th 利率：
                  td {{assetCarCoreInfo.rate | ktPercent}}
            el-col(:span="8")
              table        
                tr
                  th 尾款金额：
                  td {{assetCarCoreInfo.restAmount | ktCurrency}}
                tr
                  th 尾款比例：
                  td {{assetCarCoreInfo.restAmountPercent | ktPercent}}
                tr
                  th 尾款处理方式：
                  td {{assetCarCoreInfo.restType | statusFormat}}
                tr
                  th 车系：
                  td {{assetCarCoreInfo.seriesName}}
                tr
                  th 租约结束日期：
                  td {{assetCarCoreInfo.tenancyEndDate | moment('YYYY-MM-DD')}}
                tr
                  th 备租约起始日期：
                  td {{assetCarCoreInfo.tenancyStartDate | moment('YYYY-MM-DD')}}
                tr
                  th 租期：
                  td {{assetCarCoreInfo.tenancyTerm}}
                tr
                  th 租期单位：
                  td {{assetCarCoreInfo.tenancyTermUnit | statusFormat}}
                tr
                  th 总成本：
                  td {{assetCarCoreInfo.totalCost | ktCurrency}}
                tr
                  th 汽车vin码：
                  td {{assetCarCoreInfo.vinCode}}
                tr
                  th 年份：
                  td {{assetCarCoreInfo.year}}

  .box.mt20.box-normal
    .box-header
      | 资产保险信息
    .table-container
      el-table(:data='assetInsuranceInfoList', style='width: 100%')
        el-table-column(prop='insurantName', label='被保险人名称', width='220')
        el-table-column(prop='assetId', label='资产ID', width='220')
        el-table-column(prop='id', label='uuid', width='220')
        el-table-column(prop='insuranceFee', label='保费', width='220')
          template(scope="scope")
            span {{scope.row.insuranceFee | ktCurrency}}
        el-table-column(prop='insuranceNo', label='保单号', width='220')
        el-table-column(prop='insuranceOrgName', label='保险公司名称', width='220')
        el-table-column(prop='insurancePicPath', label='保单图片路径', width='220')
        el-table-column(prop='insuranceType', label='保险类型', width='220')
          template(scope="scope")
            span {{scope.row.insuranceType | statusFormat}}
        el-table-column(prop='insurantCode', label='被保险人社会统一信用代码', width='220')
</template>

<script>
import {
  find
} from 'lodash'

import {
  assetInfo
} from '@/common/resource.js'

import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '花生',
  value: 'HUASHENG'
}, {
  name: '大搜车',
  value: 'DSC'
}, {
  name: '弹个车APP',
  value: 'TGC'
}, {
  name: '天猫',
  value: 'TMALL'
}, {
  name: '待审核',
  value: 'WAIT_ADUIT'
}, {
  name: '审核失败',
  value: 'AUDIT_FAILED'
}, {
  name: '审核成功，待入池',
  value: 'WAIT_INTO_POOL'
}, {
  name: '已入池',
  value: 'HAVE_IN_POOL'
}, {
  name: '已出池',
  value: 'HAVE_OUT_POOL'
}, {
  name: '募集失败',
  value: 'COLLECT_FAILED'
}, {
  name: '未回购',
  value: 'NOT_BUY_BACK'
}, {
  name: '已回购-未打款',
  value: 'BUY_BACKED_UNPAID'
}, {
  name: '已回购-已打款',
  value: 'BUY_BACKED_PAID'
}, {
  name: '待推送校验',
  value: 'WAIT_PUSH_CHECK'
}, {
  name: '已推送校验',
  value: 'PUSH_CHECKED'
}, {
  name: 'POS机刷卡',
  value: 'POS'
}, {
  name: '天猫',
  value: 'TMALL'
}, {
  name: '支付宝',
  value: 'ALIPAY'
}, {
  name: '科峰时代拍卖',
  value: 'KFDEAL'
}, {
  name: '回购',
  value: 'BUY_BACK'
}, {
  name: '一次性支付尾款',
  value: 'BUY_ONCE'
}, {
  name: '按揭购车',
  value: 'MORTGAGE'
}, {
  name: '天',
  value: 'DAY'
}, {
  name: '月',
  value: 'MONTH'
}, {
  name: '年',
  value: 'YEAR'
}, {
  name: '车辆商业险',
  value: 'CAR_BUSINESS'
}, {
  name: '车辆交强险',
  value: 'CAR_COMPULSORY'
}]

export default {
  mixins: [tableListMixins],
  filters: {
    statusClass(value) {
      const classMap = {
        'AUDIT_FAILED': 'color-red',
        'WAIT_INTO_POOL': 'color-green'
      }
      return classMap[value] || ''
    },
    statusFormat(value) {
      const status = find(statusList, s => s.value === value)
      return status ? status.name : '未知状态'
    }
  },
  methods: {
    _fetchData() {
      assetInfo.post({ outerAssetOrderNo: this.$route.params.outerAssetOrderNo }, {
        loadingMaskTarget: '.asset-info-form'
      }).then(res => {
        const data = res.data.data.rows[0]
        this.assetBaseInfo = data.assetBaseInfo
        this.assetCarBackUpInfo = data.assetCarBackUpInfo
        this.assetCarCoreInfo = data.assetCarCoreInfo
        this.assetInsuranceInfoList = data.assetInsuranceInfoList
      })
    }
  },
  mounted() {
    this._fetchData()
  },
  data() {
    return {
      assetBaseInfo: {},
      assetCarBackUpInfo: {},
      assetCarCoreInfo: {},
      assetInsuranceInfoList: []
    }
  }
}
</script>

<style lang="scss">
.box {
  .box-content {
    .el-col {
      th{
        width: 180px;
      }
    }
  }
}
</style>
