<template lang="pug">
  .risk-rule
    //- .risk-rule-tem 大搜车资产风控规则模板
    .box
      .box-header
        h3 筛选条件
      .filters
        el-select(v-model="filter.assetFrom",filterable,placeholder="资产方",@change="search",)
          el-option(v-for="asset in riskAssetFroms",:key="asset.value",:value="asset.value",:label="asset.label")
        el-select(v-model="filter.type",filterable,placeholder="模板类型",@change="search",)
          el-option(v-for="type in riskTypes",:key="type.value",:value="type.value",:label="type.label")
        el-button(size="small", type="primary",@click="clearFilter")  清除
    .risk-rule-content
      .risk-rule-form
        .risk-form(v-for="risk in riskWarnDatas")
          el-form(ref="riskForm",:model="riskzrForm",label-width="100px")
            el-form-item(label="模板类型：")
              span.font-content {{risk.type | filterTem}}
            el-form-item(label="模板名称：")
              span.font-content {{risk.name}}
            el-form-item(label="风控规则：")
              .risk-row(v-for="(rule, indexr) in risk.riskRules")
                el-row
                  el-col.risk-col(:span="8")
                    //- span.risk-also(v-if='indexr !== 0 && risk.type === "WARNING"') 并且
                    //- span.risk-also(v-if='indexr !== 0 && risk.type === "ACCESS"') 或者
                    el-checkbox(:label="rule.name",v-model="rule.status",true-label="ENABLED",false-label="DISABLED",:disabled="!rule.editing")
                  el-col(:span="16")
                    .risk-filter(v-for="(detail, indexd) in rule.details")
                      //- NUMERIC
                      .risk-num(v-if="rule.inputType ==='NUMERIC'")
                        el-form-item.risk-verify
                          el-select.input-width(v-model="detail.operator",:disabled="!rule.editing" placeholder="选择")
                            el-option(v-for="operator in operators",:key="operator.value",:value="operator.value",:label="operator.label")
                        el-form-item.risk-verify(prop="numeric")
                          el-input.input-width(placeholder="请输入",:disabled="!rule.editing",v-model="detail.numbericTarget",@change="riskChange(rule, detail, indexd)")
                          .warn-verify(v-if="detail.messageWarn") {{detail.message}}
                        .el-risk-buttons
                          .risk-edit(v-if="indexd === 0")
                            el-button(size="small", type="primary",@click="ruleEdit(rule)",v-if="!rule.editing && $permit('riskEdit')") 编辑
                          .risk-a-d(v-if="indexd !== 0")
                            //- el-button(size="small", type="primary",@click="detailAdd(rule)") 并且
                            el-button(v-if="rule.editing", size="small", type="primary",@click="detailDelete(rule, indexd)") 删除
                          .el-buttons-n(v-if="rule.editing && indexd === 0")
                            el-button(size="small", type="primary",@click="detailAdd(rule)") 并且
                            el-button(size="small", type="primary",@click="ruleSubmit(rule, detail, indexd)") 保存
                            el-button(size="small", type="primary",@click="ruleCancel(rule)") 取消
                      //- BOOLEAN
                      .risk-bool(v-if="rule.inputType === 'BOOLEAN'")
                        el-form-item.risk-verify
                          el-select.input-width(v-model="detail.booleanTarget",placeholder="选择",:disabled="!rule.editing")
                            el-option(v-for="(bool,indexb) in riskBools",:key="bool.value",:value="bool.value",:label="bool.label")
                        .el-risk-buttons
                          .risk-edit(v-if="indexd === 0")
                            el-button(size="small", type="primary",@click="ruleEdit(rule)",v-if="!rule.editing && $permit('riskEdit')") 编辑
                          .risk-a-d(v-if="indexd !== 0")
                            //- el-button(size="small", type="primary",@click="detailAdd(rule)") 并且
                            el-button(v-if="rule.editing", size="small", type="primary",@click="detailDelete(rule, indexd)") 删除
                          .el-buttons-n(v-if="rule.editing && indexd === 0")
                            el-button(size="small", type="primary",@click="detailAdd(rule)") 并且
                            el-button(size="small", type="primary",@click="ruleSubmit(rule)") 保存
                            el-button(size="small", type="primary",@click="ruleCancel(rule)") 取消
</template>

<script>
import {
  riskEdit,
  riskQuery
} from '@/common/resource.js'
import {
  pruneParams
} from '@/common/util.js'
import {
  MessageBox,
  Message
} from 'element-ui'
import {
  each,
  every,
  merge,
  cloneDeep
} from 'lodash'
import {
  tableListMixins
} from '@/common/mixins.js'
export default {
  mixins: [tableListMixins],
  data() {
    return {
      backupRule: {},
      riskLine: false,
      riskWarnDatas: [],
      riskzrForm: {
        details: [],
        inputType: '',
        name: '',
        status: ''
      },
      filter: {
        assetFrom: '',
        type: ''
      },
      riskDetails: {
        booleanTarget: 1,
        numericTarget: null,
        operator: 'EQUAL',
        stringTarget: ''
      },
      // rules: {
      //   numbericTarget: [{
      //     message: '值不能为空',
      //     trigger: 'blur'
      //   }, {
      //     type: 'number',
      //     message: '必须是数字值',
      //     tirgger: 'blur'
      //   }]
      // },
      operators: [{
        value: 'EQUAL',
        label: '='
      }, {
        value: 'NOT_EQUAL',
        label: '≠'
      }, {
        value: 'GREATER_THAN',
        label: '>'
      }, {
        value: 'LESS_THAN',
        label: '<'
      }, {
        value: 'GREATER_EQUAL',
        label: '>='
      }, {
        value: 'LESS_EQUAL',
        label: '<='
      }],
      riskBools: [{
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }],
      riskAssetFroms: [{
        value: 'DSC',
        label: '大搜车'
      }, {
        value: 'HUASHENG',
        label: '花生好车'
      }],
      riskTypes: [{
        value: 'ACCESS',
        label: '准入类'
      }, {
        value: 'WARNING',
        label: '预警类'
      }]
    }
  },

  filters: {
    filterTem(value) {
      if (value === 'ACCESS') {
        return '准入模板'
      } else if (value === 'WARNING') {
        return '预警模板'
      } else {
        return '-'
      }
    }
  },

  methods: {
    riskWarnGet() {
      riskQuery.get({
        params: {
          ...pruneParams(this.filter)
        },
        loadingMaskTarget: '.risk-rule'
      }).then((res) => {
        const data = res.data
        each(data.data, v => {
          each(v.riskRules, r => {
            r.editing = false // 编辑状态
            each(r.details, d => {
              d.booleanTarget = +d.booleanTarget
              d.message = '' // 编辑状态
              d.messageWarn = false // 编辑状态
            })
          })
        })
        this.riskWarnDatas = data.data
      })
    },
    clearFilter() {
      each(this.filter, (v, k) => {
        if (k !== 'page' && k !== 'pageSize') {
          this.filter[k] = ''
        }
      })
      this.search()
    },

    ruleEdit(rule) {
      rule.editing = true
      this.backupRule[rule.id] = cloneDeep(rule)
    },

    ruleCancel(rule) {
      MessageBox.confirm('此操作会取消编辑，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        rule.editing = false
        rule.status = this.backupRule[rule.id].status
        rule.details = this.backupRule[rule.id].details
        Message({
          type: 'success',
          message: '取消成功！'
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '暂停取消'
        })
      })
    },

    ruleSubmit(rule, detail, indexd) {
      if (rule.inputType === 'NUMERIC') {
        each(rule.details, (v, k) => {
          if (v.numbericTarget === null || v.numbericTarget === '' || v.numbericTarget === undefined) {
            v.message = '值不能为空'
            v.messageWarn = true
          } else if (!Number(v.numbericTarget)) {
            v.message = '必须是数字'
            v.messageWarn = true
          } else {
            v.message = ''
            v.messageWarn = false
          }
          if (!v.id) rule.details.splice(indexd, 1, merge({}, detail))
        })
        rule.valid = every(rule.details, d => !d.messageWarn)
        if (!rule.valid) return
      }

      const ruleClone = cloneDeep(rule)
      ruleClone.details = JSON.stringify(ruleClone.details)
      riskEdit.post({
        ...pruneParams(ruleClone)
      }, {
        pathParams: {
          riskRuleId: rule.id
        },
        loadingMaskTarget: '.risk-rule'
      }).then(res => {
        Message({
          type: 'success',
          message: '保存成功'
        })
        rule.editing = false
      }).catch(res => {
        Message({
          type: 'error',
          message: '保存失败'
        })
      })
    },

    riskChange(rule, detail, indexd) {
      if (detail.numbericTarget === null || detail.numbericTarget === '') {
        detail.message = '值不能为空'
        detail.messageWarn = true
      } else if (!Number(detail.numbericTarget)) {
        detail.message = '必须是数字'
        detail.messageWarn = true
      } else {
        detail.message = ''
        detail.messageWarn = false
      }
      rule.details.splice(indexd, 1, merge({}, detail)) //新增到details里的对象添加的属性不能被vue识别
    },

    detailAdd(rule) {
      rule.details.push(merge({}, this.riskDetails))
    },

    detailDelete(rule, index) {
      rule.details.splice(index, 1)
    },
    search() {
      this.$router.push({
        name: this.$router.name,
        query: pruneParams(this.filter)
      })
    }
  },
  watch: {
    $route() {
      this.riskWarnGet()
    }
  },
  created() {
    this.filter = merge(this.filter, this.$route.query)
    this.riskWarnGet()
  }
}
</script>
<style lang="scss">
.risk-form {
  margin-bottom: 30px;
}

.risk-rule-tem {
  height: 40px;
  line-height: 40px;
  background: #f3f6f8;
  padding-left: 15px;
  overflow: hidden;
  border-radius: 4px;
}

.risk-rule-content {
  margin-top: 30px;
  border: 1px solid #f3f6f8;
  border-radius: 4px;
  overflow: hidden;
  padding: 15px;
}

.el-form-item__content {
  line-height: 34px;
  font-size: 14px;
}

.risk-filter {
  margin-bottom: 20px;
}

.input-width {
  width: 120px!important;
  margin-right: 10px;
}

.el-risk-buttons {
  display: inline-block;
  vertical-align: 0;
  margin-left: 10px;
}

.el-buttons-n,
.risk-a-d,
.risk-edit {
  display: inline-block;
  vertical-align: 0;
}

.risk-verify {
  display: inline-block;
  vertical-align: middle;
}

.risk-col {
  position: relative;
}

.risk-also {
  position: absolute;
  left: -40px;
  z-index: 99;
}

.warn-verify {
  position: absolute;
  top: 28px;
  left: 0;
  color: red;
  font-size: 13px;
}
</style>
