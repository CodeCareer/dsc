<template lang="pug">
.car-info-form
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="car", :rules="rules", ref="carInfoForm", label-width="120px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              //- el-form-item(label="品牌：", prop="type")
                el-select(v-model="demo.type", placeholder="请选择机构类型")
                  el-option(v-for="o in instTypes", :label="o.name", :value="o.value")
              el-form-item(label="品牌：", prop="brandName")
                el-input(type="text", placeholder="请输入汽车品牌", v-model="car.brandName")
              el-form-item(label="车系：", prop="seriesName")
                el-input(type="text", placeholder="请输入汽车车系", v-model="car.seriesName")
              el-form-item(label="车型：", prop="modelName")
                el-input(type="text", placeholder="请输入汽车车型", v-model="car.modelName")
              el-form-item(label="厂商指导价：", prop="guidePrice")
                el-input(type="text", placeholder="请输入指导价", v-model="car.guidePrice")
                  template(slot="prepand") ¥
              el-form-item(label="残值金额：", prop="residualValue")
                el-input(type="text", placeholder="请输入残值金额", v-model="car.residualValue")
    .bottom-buttons
      el-button(type="primary", size="small", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  updateCrumb
} from '@/common/crosser.js'

export default {
  methods: {
    submitForm() {
      console.info('测试账号不支持此功能！')
    },
    cancel() {
      this.$confirm('内容尚未保存，确定取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    }
  },
  mounted() {
    if (this.$route.params.id !== 'add') {
      const name = this.$route.params.id
      updateCrumb.$emit('update-crumbs', [{
        id: 'carInfoForm',
        name: name
      }])
    }
  },
  data() {
    return {
      title: '新增基础车型',
      loadingInstance: {
        close() {}
      },
      rules: {
        type: [{
          required: true,
          message: '请选择机构类型',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入机构全称',
          trigger: 'blur'
        }],
        shortName: [{
          required: true,
          message: '请输入机构简称',
          trigger: 'blur'
        }]
      },
      car: {
        brandName: null,
        seriesName: null,
        modelName: null,
        guidePrice: null,
        residualValue: null
      },
      instTypes: [{
        name: '资金渠道',
        value: '0'
      }, {
        name: '资产渠道',
        value: '1'
      }, {
        name: '托管机构',
        value: '2'
      }, {
        name: '增信机构',
        value: '3'
      }, {
        name: '投资顾问',
        value: '4'
      }],
      manageScopes: [{
        name: '金融信息服务',
        value: '0'
      }, {
        name: '计算机网络技术',
        value: '1'
      }, {
        name: '技术服务',
        value: '2'
      }, {
        name: '增信机构',
        value: '3'
      }, {
        name: '投资顾问',
        value: '4'
      }]
    }
  }
}
</script>

<style lang="scss">
.car-info-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
</style>
