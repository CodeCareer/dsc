<template lang="pug">
  .risk-rule
    .risk-rule-tem 大搜车资产风控规则模板
    .risk-rule-content
      .risk-rule-form
        .risk-form(v-for="risk in riskWarnDatas")
          el-form(ref="riskForm",:rules="rules",:model="riskzrForm",label-width="80px")
            el-form-item(label="模板类型：")
              span.font-content {{risk.type}}
            el-form-item(label="模板名称：")
              span.font-content {{risk.name}}
            el-form-item(label="风控规则：")
              .risk-row(v-for="(rule, indexr) in risk.riskRules")
                el-row
                  el-col.risk-col(:span="8")
                    span.risk-also(v-if='indexr !== 0 && risk.type === "WARNING"') 并且
                    span.risk-also(v-if='indexr !== 0 && risk.type === "ACCESS"') 或者
                    el-checkbox(:label="rule.name",v-model="rule.status",true-label="ENABLED")
                  el-col(:span="14")
                    .risk-filter(v-for="(detail, indexd) in rule.details")
                      //- NUMERIC
                      .risk-num(v-if="rule.inputType ==='NUMERIC'")
                        el-form-item.risk-verify
                          el-select.input-width(v-model="detail.operator",:disabled="!rule.editing" placeholder="选择")
                            el-option(v-for="operator in operators",:key="operator.value",:value="operator.value",:label="operator.label")
                        el-form-item.risk-verify
                          el-input.input-width(:placeholder="rule.name",:disabled="!rule.editing",v-model="detail.numericTarget")
                        .el-buttons
                          .risk-edit(v-if="indexd === 0")
                            el-button(size="small", type="primary",@click="ruleEdit(rule)",v-if="!rule.editing") 编辑
                          .risk-a-d(v-if="indexd !== 0")
                            //- el-button(size="small", type="primary",@click="detailAdd(rule)") 并且
                            el-button(v-if="rule.editing", size="small", type="primary",@click="detailDelete(rule, indexd)") 删除
                          .el-buttons-n(v-if="rule.editing && indexd === 0")
                            el-button(size="small", type="primary",@click="detailAdd(rule)") 并且
                            el-button(size="small", type="primary",@click="ruleSubmit(rule)") 保存
                            el-button(size="small", type="primary",@click="ruleCancel(rule)") 取消
                      //- BOOLEAN
                      .risk-bool(v-if="rule.inputType === 'BOOLEAN'")
                        el-form-item.risk-verify
                          el-select.input-width(v-model="detail.booleanTarget",placeholder="选择",:disabled="!rule.editing")
                            el-option(v-for="(bool,indexb) in riskBools",:key="bool.value",:value="bool.value",:label="bool.label")
                        .el-buttons
                          .risk-edit(v-if="indexd === 0")
                            el-button(size="small", type="primary",@click="ruleEdit(rule)",v-if="!rule.editing") 编辑
                          .risk-a-d(v-if="indexd !== 0")
                            //- el-button(size="small", type="primary",@click="detailAdd(rule)") 并且
                            el-button(v-if="rule.editing", size="small", type="primary",@click="detailDelete(rule, detail)") 删除
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
  merge,
  cloneDeep
  // remove
} from 'lodash'
export default{
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
      riskQuery: {
        assetFrom: '',
        type: ''
      },
      riskDetails: {
        booleanTarget: 0,
        numericTarget: 20,
        operator: 'greateEqual',
        stringTarget: '测试内容r42v'
      },
      rules: {},
      operators: [{
        value: 'greateEqual',
        label: '>='
      }, {
        value: 'lessEqual',
        label: '=<'
      }],
      riskBools: [{
        value: 1,
        label: '为真'
      }, {
        value: 0,
        label: '为假'
      }]
    }
  },
  methods: {
    riskWarnGet() {
      const loadingInstance = this.$loading({
        target: '.risk-rule'
      })
      riskQuery.get({
        params: {
          ...pruneParams(this.riskQuery)
        }
      }).then((res) => {
        const data = res.data

        each(data.riskRuleTemplates, v => {
          each(v.riskRules, r => {
            // this.backupRule[r.id] =
            r.editing = false // 编辑状态
            each(r.details, d => {
              d.booleanTarget = +d.booleanTarget
              return d
            })
          })
        })
        console.log(this.riskWarnDatas)
        this.riskWarnDatas = data.riskRuleTemplates
        loadingInstance.close()
      })
    },

    ruleEdit(rule) {
      rule.editing = true
      this.backupRule[rule.id] = cloneDeep(rule.details)
    },

    ruleCancel(rule) {
      MessageBox.confirm('此操作会取消编辑，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        rule.editing = false
        rule.details = this.backupRule[rule.id]
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

    ruleSubmit(rule) {
      // merge(this.riskzrForm, cloneDeep(rule))
      console.log(rule)
      riskEdit.post({
        ...pruneParams(rule)
      }, {pathParams: {
        riskRuleId: rule.id
      }}).then((res) => {
        Message({
          type: 'success',
          message: '保存成功'
        })
      })
    },

    detailAdd(rule) {
      rule.details.push(merge({}, this.riskDetails))
    },

    detailDelete(rule, index) {
      rule.details.splice(index, 1)
    }
  },

  mounted() {
    this.riskWarnGet()
  }
}
</script>
<style lang="scss">
  .risk-form{
    margin-bottom:30px;
  }
  .risk-rule-tem{
    height: 40px;
    line-height: 40px;
    background: #f3f6f8;
    padding-left: 15px;
    overflow: hidden;
    border-radius: 4px;
  }
  .risk-rule-content{
    margin-top:30px;
    border:1px solid #f3f6f8;
    border-radius: 4px;
    overflow: hidden;
    padding:15px;
  }
  .el-form-item__content{
    line-height: 34px;
    font-size:14px;
  }
  .risk-filter{
    margin-bottom: 10px;
    overflow: hidden;
  }
  .input-width{
    float:left;
    width:120px!important;
    margin-right:10px;
  }
  .el-buttons{
    float:left;
    margin-left:20px;
    margin-top:-2px;
  }
  .el-buttons-n{
    // margin-left:10px;
    display: inline-block;
  }
  .risk-row{
    margin-bottom:10px;
    // overflow: hidden;
  }
  .risk-verify,.risk-a-d,.risk-edit{
    float:left;
    margin-right:10px;
  }
  .risk-col{
    position: relative;
  }
  .risk-also{
    position: absolute;
    left:-40px;
    z-index:99;
  }
  // .risk-a-d{
  //   button{
  //     margin-right:10px;
  //   }
  // }
</style>
