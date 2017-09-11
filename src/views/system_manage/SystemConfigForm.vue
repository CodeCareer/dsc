<template lang="pug">
.system-config-form
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="systemConfigData", ref="systemConfigForm", label-width="120px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              el-form-item(label="配置编号：", prop="configNo")
                span {{systemConfigData.configNo}}
              el-form-item(label="配置名称：", prop="configName")
                el-input(type="text", placeholder="请输入配置名称", v-model="systemConfigData.configName")
              el-form-item(label="配置值：", prop="configValue")
                el-input(type="textarea", placeholder="请输入配置值", :maxlength="500", :autosize="{ minRows: 4, maxRows: 6}", v-model="systemConfigData.configValue")
              el-form-item(label="备注：", prop="remark")
                el-input(type="textarea", placeholder="请输入备注", :maxlength="500", :autosize="{ minRows: 4, maxRows: 6}", v-model="systemConfigData.remark")
    .bottom-buttons
      el-button(type="primary", size="small", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  sysConfigUpdate
} from '@/common/resource.js'
import {
  merge
} from 'lodash'

export default {
  methods: {
    submitForm() {
      this.$refs.systemConfigForm.validate((valid) => {
        if (valid) {
          this.edit()
        }
      })
    },

    edit() {
      sysConfigUpdate.post(this.systemConfigData, {
        loadingMaskTarget: '.system-config-form'
      }).then(res => {
        const data = res.data
        this.operationStatus(data)
      })
    },

    cancel() {
      this.$confirm('内容尚未保存，确定取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },

    operationStatus(data) {
      if (data.resultCode === 'SUCCESS') {
        this.$message.success({
          message: data.resultMsg || '成功！'
        })
        this.$router.back()
      } else {
        this.$message.error({
          message: data.resultMsg || '失败！'
        })
      }
    }
  },
  created() {
    merge(this.systemConfigData, this.$route.params)
  },

  data() {
    return {
      title: '修改系统配置项',
      systemConfigData: {
        configNo: '',
        configValue: '',
        configName: '',
        remark: ''
      }
    }
  }
}
</script>

<style lang="scss">
.system-config-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
</style>
