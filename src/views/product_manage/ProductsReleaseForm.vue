<template lang="pug">
.products-release-form
  .box
    .box-header
      | {{title}}
    .box-content
      .box-section
        el-form(:model="product", :rules="rules", ref="productForm")
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
                    td {{product.assetFrom | statusFormat}}
                  tr
                    th 产品状态：
                    td {{product.productStatus | statusFormat}}
                  tr
                    th 发行利率：
                    td {{product.profitYearRate | ktPercent}}
                  tr
                    th 上架日期：
                    td {{product.carriageDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
              el-col(:span="8")
                table
                  tr
                    th 下架日期：
                    td {{product.underDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                  tr
                    th 起息日期：
                    td {{product.valueDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                  tr
                    th 期限：
                    td {{product.term}}
                  tr
                    th 申请融资金额：
                    td {{product.requestAmount}}
                  tr
                    th 到期日：
                    td {{product.dueDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                  tr(v-if="product.productStatus === 'AUTO_AUDIT_FAIL_WAIT_CONFIRMED'") 
                    th 
                    td
                      el-form-item(label="备注：", prop="remark")
                        el-input(type="textarea", placeholder="请输入备注", :autosize="{ minRows: 2, maxRows: 4}" :maxlength="500", v-model="product.remark")
                  tr(v-else) 
                    th 备注：
                    td {{product.remark}}
              el-col(:span="8")
                table     
                  tr
                    th 实际募集金额：
                    td {{product.factCollectAmount}}   
                  tr
                    th 到期应对付总金额：
                    td {{product.redeemAmount}}
                  tr
                    th 到期应付总收益：
                    td {{product.dueTotalInterest}}
                  tr
                    th 实际到期日期：
                    td {{product.factDueDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                  tr
                    th 实际兑付给投资人总金额：
                    td {{product.factRedeemAmount}}
                  tr
                    th 最早可提前还款日期：
                    td {{product.minPreDueDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
    .bottom-buttons 
      el-button(v-if="product.productStatus === 'AUTO_AUDIT_FAIL_WAIT_CONFIRMED'", type="primary", size="small", @click="audit('PASSED')") 通过
      el-button(v-if="product.productStatus === 'AUTO_AUDIT_FAIL_WAIT_CONFIRMED'", type="gray", size="small", @click="audit('DENIED')") 驳回
      el-button(size="small", @click="cancel") 返回
</template>

<script>
import {
  find
} from 'lodash'

import {
  updateCrumb
} from '@/common/crosser.js'

import {
  productsAudit,
  productsRelease
} from '@/common/resource.js'

import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '大搜车',
  value: 'DSC'
}, {
  name: '花生',
  value: 'HUASHENG'
}, {
  name: '待审核',
  value: 'WAITING_AUDIT'
}, {
  name: '自动审核失败，待确认',
  value: 'AUTO_AUDIT_FAIL_WAIT_CONFIRMED'
}, {
  name: '审核成功，待募集',
  value: 'WAITING_COLLECT'
}, {
  name: '审核失败',
  value: 'AUDIT_FAIL'
}, {
  name: '募集中',
  value: 'COLLECTING'
}, {
  name: '已成立',
  value: 'DURATION'
}, {
  name: '募集失败',
  value: 'COLLECT_FAIL'
}, {
  name: '已回款',
  value: 'FINISHED'
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
    audit(data) {
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          const confirmMsg = data === 'PASSED' ? '确定审核通过吗？' : '确定审核驳回吗？'
          this.$confirm(confirmMsg, '提示', {
            type: 'warning'
          }).then(() => {
            this.productsAudit(data)
          })
        }
      })
    },

    productsAudit(data) {
      productsAudit.post({id: this.$route.params.id, auditResult: data, remark: this.product.remark}, {
        loadingMaskTarget: '.products-release-form'
      }).then(res => {
        const data = res.data
        this.operationStatus(data)
      })
    },

    _fetchData() {
      productsRelease.post({ id: this.$route.params.id }, {
        loadingMaskTarget: '.products-release-form'
      }).then(res => {
        this.product = res.data.data.rows[0]
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
    this._fetchData()
  },
  data() {
    return {
      title: '产品发行审核',
      loadingInstance: {
        close() {}
      },
      product: {},
      rules: {
        remark: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
      }
    }
  }
}
</script>

<style lang="scss">
.products-release-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
.box {
  .box-content {
    .el-col {
      th{
        width: 180px;
      }
      td{
        .el-form-item{
              position: relative;
              left: -52px;
        }
        .el-form-item__content{
          display: inline-block;
        }
      }
    }
  }
}
  
</style>
