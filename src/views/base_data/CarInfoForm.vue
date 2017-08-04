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
              el-form-item(label="品牌：", prop="brandName")
                el-input(type="text", placeholder="请输入汽车品牌", v-model="car.brandName")
              el-form-item(label="车系：", prop="seriesName")
                el-input(type="text", placeholder="请输入汽车车系", v-model="car.seriesName")
              el-form-item(label="车型：", prop="modelName")
                el-input(type="text", placeholder="请输入汽车车型", v-model="car.modelName")
              el-form-item(label="厂商指导价：", prop="guidePrice")
                el-input(type="text", placeholder="请输入指导价", v-model="car.guidePrice")
                  template(slot="prepend") ¥
                  template(slot="append") 元
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
import {
  carInfos
} from '@/common/resource.js'
import {
  merge
} from 'lodash'

export default {
  methods: {
    submitForm() {
      this.$refs.carInfoForm.validate((valid) => {
        if (valid) {
          carInfos[this.car.id ? 'put' : 'post'](this.car, {
            loadingMaskTarget: '.car-info-form',
            pathParams: {
              id: this.car.id || ''
            }
          }).then(res => {
            this.$message.success('保存成功！')
            this.$router.push({
              name: 'carInfo'
            })
          }).catch(err => {
            this.$message.error(err.msg)
          })
        }
      })
    },

    cancel() {
      this.$confirm('内容尚未保存，确定取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.back()
      }).catch(() => {})
    }
  },

  mounted() {
    if (this.$route.params.id !== 'add') {
      const id = this.$route.params.id

      carInfos.get({
        pathParams: {
          id
        },
        loadingMaskTarget: '.car-info-form'
      }).then(res => {
        merge(this.car, res.data.data)
        this.title = '编辑基础车型'
      })

      updateCrumb.$emit('update-crumbs', [{
        id: 'carInfoForm',
        name: '编辑基础车型'
      }])
    }
  },

  data() {
    return {
      title: '新增基础车型',
      rules: {
        brandName: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        seriesName: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        modelName: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        guidePrice: [{
          pattern: /^\d+$/,
          message: '请正确填写指导价',
          trigger: 'change'
        }],
        residualValue: [{
          pattern: /^\d+$/,
          message: '请正确填写残值金额',
          trigger: 'change'
        }]
      },
      car: {
        id: null,
        brandName: null,
        seriesName: null,
        modelName: null,
        guidePrice: null,
        residualValue: null
      }
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
