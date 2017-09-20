<template lang="pug">
.asset-info-form
  .box
    .box-header
      | 资产基础信息
      .buttons
        el-button(type="primary", size="small", @click="accessControl(assetBaseInfo.id)")
          | 准入校验结果
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 融资租赁协议编号：
                  td {{assetBaseInfo.contractNo}}
                tr
                  th 姓名：
                  td {{assetBaseInfo.name}}
                tr
                  th 年龄：
                  td {{assetBaseInfo.age}}
                tr
                  th 厂商指导价：
                  td {{assetCarCoreInfo.guidePrice | ktCurrency}}
                tr
                  th 月供金额：
                  td {{assetCarCoreInfo.instalmentAmount | ktCurrency}}
                tr
                  th 支付宝账号：
                  td {{assetBaseInfo.alipayAccount}}
                tr
                  th 资产来源：
                  td {{assetBaseInfo.assetFrom | statusFormat}}
                tr
                  th 外部资产订单编号：
                  td {{assetBaseInfo.outerAssetOrderNo}}
                tr
                  th 资产来源明细：
                  td {{assetBaseInfo.assetFromDetail | statusFormat}}
                tr
                  th 入池日期：
                  td {{assetBaseInfo.inPoolDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                tr
                  th 已还款金额：
                  td {{assetBaseInfo.haveRepayedAmount | ktCurrency}}
                tr
                  th 已还款期数：
                  td {{assetBaseInfo.haveRepayedPeriods}}
                tr
                  th 学历：
                  td {{assetBaseInfo.edu}}
                tr
                  th 其他身份证明文件：
                  td(v-if='assetBaseInfo.otherCertPicsPath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetBaseInfo.otherCertPicsPath.split(',')")
                  td(v-else) 无文件
            el-col(:span="8")
              table
                tr
                  th 资产ID：
                  td {{assetBaseInfo.id}}
                tr
                  th 证件类型：
                  td {{assetBaseInfo.certType | statusFormat}}
                tr
                  th 租约起始日期：
                  td {{assetCarCoreInfo.tenancyStartDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                tr
                  th 首付金额：
                  td {{assetCarCoreInfo.downPaymentsAmount | ktCurrency}}
                tr
                  th 尾款金额：
                  td {{assetCarCoreInfo.restAmount | ktCurrency}}
                tr
                  th 支付宝用户ID：
                  td {{assetBaseInfo.alipayUserId}}
                tr
                  th 资产状态：
                  td {{assetBaseInfo.assetStatus | statusFormat}}
                tr
                  th 下单时间戳：
                  td {{assetBaseInfo.orderDateTime | moment('YYYY-MM-DD')}}
                tr
                  th 合同协议路径：
                  td(v-if='assetBaseInfo.contractFilesPath') 
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetBaseInfo.contractFilesPath.split(',')")
                  td(v-else) 无附件
                tr
                  th 出池日期：
                  td {{assetBaseInfo.outPoolDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                tr
                  th 还款总期数：
                  td {{assetBaseInfo.repayPeriods}}
                tr
                  th 创建时间戳：
                  td {{assetBaseInfo.createDateTime | moment('YYYY-MM-DD HH:mm:ss')}}
                tr
                  th 银行卡号：
                  td {{assetBaseInfo.bankCardNo}}
            el-col(:span="8")
              table     
                tr
                  th 产品代码：
                  td {{assetBaseInfo.productCode}}
                tr
                  th 证件号码：
                  td {{assetBaseInfo.certNo}}
                tr
                  th 租约结束日期：
                  td {{assetCarCoreInfo.tenancyEndDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                tr
                  th 首付比例：
                  td {{assetCarCoreInfo.downPaymentsPercent | ktPercent}}
                tr
                  th 电话号码：
                  td  {{assetBaseInfo.phoneNum}}
                tr
                  th 身份证正面照片路径：
                  td(v-if='assetBaseInfo.certFrontPicPath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetBaseInfo.certFrontPicPath.split(',')")
                  td(v-else) 无附件
                tr
                  th 身份证反面照片路径：
                  td(v-if='assetBaseInfo.certBackPicPath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetBaseInfo.certBackPicPath.split(',')")
                  td(v-else) 无附件
                tr
                  th 回购状态：
                  td {{assetBaseInfo.buyBackStatus | statusFormat}}
                tr
                  th 推送状态：
                  td {{assetBaseInfo.pushStatus | statusFormat}}
                tr
                  th 待还款金额：
                  td {{assetBaseInfo.waitRepayAmount | ktCurrency}}
                tr
                  th 待还款期数：
                  td {{assetBaseInfo.waitRepayPeriods}}
                tr
                  th 其他合同协议路径：
                  td(v-if='assetBaseInfo.otherContractFilesPath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetBaseInfo.otherContractFilesPath.split(',')")
                  td(v-else) 无附件
                tr
                  th 开户行：
                  td {{assetBaseInfo.bankName}}

  .box.mt20(v-if="assetCarCoreInfo")
    .box-header
      | 资产核心车贷信息
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 品牌名称：
                  td {{assetCarCoreInfo.brandName}}
                tr
                  th 厂商指导价：
                  td {{assetCarCoreInfo.guidePrice | ktCurrency}}
                tr
                  th 名义月供金额：
                  td {{assetCarCoreInfo.nameInstalmentsAmount | ktCurrency}}
                tr
                  th 尾款金额：
                  td {{assetCarCoreInfo.restAmount | ktCurrency}}
                tr
                  th 利率：
                  td {{assetCarCoreInfo.rate | ktPercent}}
                tr
                  th uuid：
                  td {{assetCarCoreInfo.id}}
                tr
                  th 提车日期：
                  td {{assetCarCoreInfo.pickUpDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                tr
                  th 外部系统车型的编码：
                  td {{assetCarCoreInfo.outerCarTypeCode}}
                tr
                  th 首付支付流水号：
                  td {{assetCarCoreInfo.downPaymentsPayNo}}
                tr
                  th 无源GPS代码：
                  td {{assetCarCoreInfo.gpsNonSourceCode}}
                tr
                  th 无源GPS供应商名称：
                  td {{assetCarCoreInfo.gpsNonSourceOrgName}}
                tr
                  th 剩余期数：
                  td {{assetCarCoreInfo.leftTerm}}
            el-col(:span="8")
              table
                tr
                  th 车系：
                  td {{assetCarCoreInfo.seriesName}}
                tr
                  th 首付金额：
                  td {{assetCarCoreInfo.downPaymentsAmount | ktCurrency}}
                tr
                  th 月供金额：
                  td {{assetCarCoreInfo.instalmentAmount | ktCurrency}}
                tr
                  th 尾款比例：
                  td {{assetCarCoreInfo.restAmountPercent | ktPercent}}
                tr
                  th 租期：
                  td {{assetCarCoreInfo.tenancyTerm}}
                tr
                  th 资产ID：
                  td {{assetCarCoreInfo.assetId}}
                tr
                  th 保险费用：
                  td {{assetCarCoreInfo.insuranceFee | ktCurrency}}
                tr
                  th 省份：
                  td {{assetCarCoreInfo.province}}
                tr
                  th 首付支付方式：
                  td {{assetCarCoreInfo.downPaymentsPayType | statusFormat}}
                tr
                  th 有源GPS供应商名称：
                  td {{assetCarCoreInfo.gpsSourceOrgName}}
                tr
                  th 有源GPS代码：
                  td {{assetCarCoreInfo.gpsSoureCode}}
                tr
                  th 用户已还本金：
                  td {{assetCarCoreInfo.repaidPrincipal | ktCurrency}}
            el-col(:span="8")
              table    
                tr
                  th 车型：
                  td {{assetCarCoreInfo.modelName}}
                tr
                  th 首付比例：
                  td {{assetCarCoreInfo.downPaymentsPercent | ktPercent}}
                tr
                  th 总成本：
                  td {{assetCarCoreInfo.totalCost | ktCurrency}}
                tr
                  th 尾款处理方式：
                  td {{assetCarCoreInfo.restType | statusFormat}}
                tr
                  th 租期单位：
                  td {{assetCarCoreInfo.tenancyTermUnit | statusFormat}}
                tr
                  th 汽车vin码：
                  td {{assetCarCoreInfo.vinCode}}
                tr
                  th 年份：
                  td {{assetCarCoreInfo.year}}
                tr
                  th 城市：
                  td {{assetCarCoreInfo.city}}
                tr
                  th 车牌号：
                  td {{assetCarCoreInfo.plateNumber}}
                tr
                  th 实际尾款金额：
                  td {{assetCarCoreInfo.factRestAmount | ktCurrency}}
                tr
                  th 融资本金：
                  td {{assetCarCoreInfo.financingPrincipal | ktCurrency}}
                tr
                  th 剩余本金：
                  td {{assetCarCoreInfo.leftPrincipal | ktCurrency}}
  .box.mt20(v-if="assetCarBackUpInfo")
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
                  td(v-if='assetCarBackUpInfo.carDrivingPermitCertPath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetCarBackUpInfo.carDrivingPermitCertPath.split(',')")
                  td(v-else) 无附件
                tr
                  th 车辆登记证路径：
                  td(v-if='assetCarBackUpInfo.carRegisterCertPath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetCarBackUpInfo.carRegisterCertPath.split(',')")
                  td(v-else) 无附件
                tr
                  th 驾驶证照片路径：
                  td(v-if='assetCarBackUpInfo.drivingLicencePicPath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetCarBackUpInfo.drivingLicencePicPath.split(',')")
                  td(v-else) 无附件
                tr
                  th 车船税：
                  td {{assetCarBackUpInfo.carTax | ktCurrency}}
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
                tr
                  th 购车发票路径：
                  td(v-if='assetCarBackUpInfo.invoicePath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetCarBackUpInfo.invoicePath.split(',')")
                  td(v-else) 无附件
            el-col(:span="8")
              table        
                tr
                  th 提车确认单文件路径：
                  td(v-if='assetCarBackUpInfo.pickUpFilePath')
                    down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="assetCarBackUpInfo.pickUpFilePath.split(',')")
                  td(v-else) 无附件
                tr
                  th 购置税：
                  td {{assetCarBackUpInfo.purchasTax | ktCurrency}}
                tr
                  th 采购基准价：
                  td {{assetCarBackUpInfo.purchasePrice | ktCurrency}}
                tr
                  th 二手车处置费：
                  td {{assetCarBackUpInfo.secondHandHandleFee | ktCurrency}}

  .box.mt20.box-normal
    .box-header
      | 资产保险信息
    .table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data='assetInsuranceInfoList', style='width: 100%')
        el-table-column(prop='insurantName', label='被保险人名称', width='120')
        el-table-column(prop='assetId', label='资产ID', width='250')
        el-table-column(prop='id', label='uuid', width='250')
        el-table-column(prop='insuranceFee', label='保费', width='100')
          template(scope="scope")
            span {{scope.row.insuranceFee | ktCurrency}}
        el-table-column(prop='insuranceNo', label='保单号', width='100')
        el-table-column(prop='insuranceOrgName', label='保险公司名称', width='150')
        el-table-column(prop='insurancePicPath', label='保单图片路径', width='120')
          template(scope="scope")
            span(v-if='scope.row.insurancePicPath')
              down-load(:assetFrom="assetBaseInfo.assetFrom", :filePath="scope.row.insurancePicPath.split(',')")
            span(v-else) 无附件
        el-table-column(prop='insuranceType', label='保险类型', width='100')
          template(scope="scope")
            span {{scope.row.insuranceType | statusFormat}}
        el-table-column(prop='insuranceOrgCode', label='保险公司代码', width='160')
        el-table-column(prop='insurantCode', label='被保险人社会统一信用代码', width='200')
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

import DownLoad from '@/components/DownLoad.vue'

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
  name: '待审核',
  value: 'WAIT_AUDIT'
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
  name: '其他',
  value: 'OTHER'
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
}, {
  name: '身份证',
  value: '1'
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
      return status ? status.name : '-'
    },
    download(value) {
      const arr = value.split(',')
      let result = ''
      let num = ''
      for (let item in arr) {
        if (arr.length > 1) {
          num = parseInt(item) + 1
        }
        result += '<a class="color-blue download" onclick="downloadAttachment(' + '\'' + arr[item] + '\'' + ')" href="javascript:;">下载附件' + num + '</a>'
      }
      return result
    }
  },
  methods: {
    _fetchData() {
      assetInfo.post({ assetId: this.$route.params.assetId }, {
        loadingMaskTarget: '.asset-info-form'
      }).then(res => {
        const data = res.data.data.rows[0]
        this.assetBaseInfo = data.assetBaseInfo
        this.assetCarBackUpInfo = data.assetCarBackUpInfo
        this.assetCarCoreInfo = data.assetCarCoreInfo
        this.assetInsuranceInfoList = data.assetInsuranceInfoList
      })
    },
    accessControl(id) {
      this.$router.push({
        name: 'accessControl',
        query: {subjectId: id}
      })
    }
  },
  components: {
    DownLoad
  },
  created() {
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
.download{
  display:inline-block;
  margin-right:5px;
}
</style>
