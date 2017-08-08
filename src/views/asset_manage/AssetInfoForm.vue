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
                  th 产品名称：
                  td {{product.productName}}
                tr
                  th 产品代码：
                  td {{product.productCode}}
                tr
                  th 资产来源：
                  td {{product.assetFrom}}
                tr
                  th 产品状态：
                  td {{product.productStatus}}
                tr
                  th 发行利率：
                  td {{product.profitYearRate | ktPercent}}
                tr
                  th 上架日期：
                  td {{product.carriageDate}}
            el-col(:span="8")
              table
                tr
                  th 下架日期：
                  td {{product.underDate}}
                tr
                  th 起息日期：
                  td {{product.valueDate}}
                tr
                  th 期限：
                  td {{product.term}}
                tr
                  th 申请融资金额：
                  td {{product.requestAmount}}
                tr
                  th 到期日：
                  td {{product.dueDate}}
                tr
                  th 实际募集金额：
                  td {{product.factCollectAmount}}
            el-col(:span="8")
              table        
                tr
                  th 到期应付总收益：
                  td {{product.dueTotalInterest}}
                tr
                  th 实际到期日期：
                  td {{product.factDueDate}}
                tr
                  th 实际兑付给投资人总金额：
                  td {{product.factRedeemAmount}}
                tr
                  th 最早可提前还款日期：
                  td {{product.minPreDueDate}}
                tr
                  th 到期应对付总金额：
                  td {{product.redeemAmount}}
                tr
                  th 备注：
                  td  {{product.remark}}

  .box.mt20
    .box-header
      | 资产车贷备用信息
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 产品名称：
                  td {{product.productName}}
                tr
                  th 产品代码：
                  td {{product.productCode}}
                tr
                  th 资产来源：
                  td {{product.assetFrom}}
                tr
                  th 产品状态：
                  td {{product.productStatus}}
                tr
                  th 发行利率：
                  td {{product.profitYearRate | ktPercent}}
                tr
                  th 上架日期：
                  td {{product.carriageDate}}
            el-col(:span="8")
              table
                tr
                  th 下架日期：
                  td {{product.underDate}}
                tr
                  th 起息日期：
                  td {{product.valueDate}}
                tr
                  th 期限：
                  td {{product.term}}
                tr
                  th 申请融资金额：
                  td {{product.requestAmount}}
                tr
                  th 到期日：
                  td {{product.dueDate}}
                tr
                  th 实际募集金额：
                  td {{product.factCollectAmount}}
            el-col(:span="8")
              table        
                tr
                  th 到期应付总收益：
                  td {{product.dueTotalInterest}}
                tr
                  th 实际到期日期：
                  td {{product.factDueDate}}
                tr
                  th 实际兑付给投资人总金额：
                  td {{product.factRedeemAmount}}
                tr
                  th 最早可提前还款日期：
                  td {{product.minPreDueDate}}
                tr
                  th 到期应对付总金额：
                  td {{product.redeemAmount}}
                tr
                  th 备注：
                  td  {{product.remark}}

  .box.mt20
    .box-header
      | 资产核心车贷信息
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 产品名称：
                  td {{product.productName}}
                tr
                  th 产品代码：
                  td {{product.productCode}}
                tr
                  th 资产来源：
                  td {{product.assetFrom}}
                tr
                  th 产品状态：
                  td {{product.productStatus}}
                tr
                  th 发行利率：
                  td {{product.profitYearRate | ktPercent}}
                tr
                  th 上架日期：
                  td {{product.carriageDate}}
            el-col(:span="8")
              table
                tr
                  th 下架日期：
                  td {{product.underDate}}
                tr
                  th 起息日期：
                  td {{product.valueDate}}
                tr
                  th 期限：
                  td {{product.term}}
                tr
                  th 申请融资金额：
                  td {{product.requestAmount}}
                tr
                  th 到期日：
                  td {{product.dueDate}}
                tr
                  th 实际募集金额：
                  td {{product.factCollectAmount}}
            el-col(:span="8")
              table        
                tr
                  th 到期应付总收益：
                  td {{product.dueTotalInterest}}
                tr
                  th 实际到期日期：
                  td {{product.factDueDate}}
                tr
                  th 实际兑付给投资人总金额：
                  td {{product.factRedeemAmount}}
                tr
                  th 最早可提前还款日期：
                  td {{product.minPreDueDate}}
                tr
                  th 到期应对付总金额：
                  td {{product.redeemAmount}}
                tr
                  th 备注：
                  td  {{product.remark}}

  .box.mt20.box-normal
    .box-header
      | 资产保险信息
    .table-container
      el-table(:data='assetInfo', style='width: 100%')
        el-table-column(prop='assetBaseInfo.alipayAccount', label='账户名称', width='220')
        el-table-column(prop='assetBaseInfo.outerAssetOrderNo', label='外部资产订单编号', width='220')
        el-table-column(prop='assetBaseInfo.assetFrom', label='账户类型', width='80')
          template(scope="scope")
            span {{scope.row.assetBaseInfo.assetFrom | statusFormat}}
        el-table-column(prop='assetBaseInfo.productCode', label='产品代码', width='220')
        el-table-column(prop='assetBaseInfo.assetStatus', label='资产状态', width='220')
          template(scope="scope")
            span {{scope.row.assetBaseInfo.assetStatus | statusFormat}}
        el-table-column(prop='assetBaseInfo.buyBackStatus', label='回购状态', width='220')
          template(scope="scope")
            span {{scope.row.assetBaseInfo.buyBackStatus | statusFormat}}
        el-table-column(prop='assetBaseInfo.phoneNum', label='电话号码', width='220')
        el-table-column(prop='assetBaseInfo.pushStatus', label='推送状态', width='220')
          template(scope="scope")
            span {{scope.row.assetBaseInfo.pushStatus | statusFormat}}
</template>

<script>
import {
  updateCrumb
} from '@/common/crosser.js'

import {
  productsAudit
} from '@/common/resource.js'

import {
  tableListMixins
} from '@/common/mixins.js'

export default {
  mixins: [tableListMixins],
  methods: {
    audit() {
      this.$confirm('确定审核通过吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.productsAudit()
      })
    },

    productsAudit() {
      productsAudit.post({id: this.$route.params.id}, {
        loadingMaskTarget: '.products-release'
      }).then(res => {
        const data = res.data
        this.operationStatus(data)
      })
    },

    operationStatus(data) {
      if (data.resultCode === 'SUCCESS') {
        this.$message.success({
          message: data.resultMsg || '审核成功！'
        })
        this.$router.back()
      } else {
        this.$message.error({
          message: data.resultMsg || '审核失败！'
        })
      }
    },

    cancel() {
      this.$router.back()
    }
  },
  mounted() {
    const name = this.$route.params.productName
    updateCrumb.$emit('update-crumbs', [{
      id: 'productsReleaseForm',
      name: name
    }])
    this.product = this.$route.params
  },
  data() {
    return {
      title: '产品发行审核',
      loadingInstance: {
        close() {}
      },
      product: {}
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
