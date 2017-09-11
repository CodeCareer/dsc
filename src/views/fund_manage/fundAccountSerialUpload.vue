<template lang="pug">
.fund-account-serial-upload
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="uploadData" :rules="rules", ref="fundAccountSerialForm", label-width="120px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              el-form-item(label="账户名称：", prop="fundAccountId")
                el-select(v-model="uploadData.fundAccountId", placeholder="请选择账户")
                  el-option(v-for="t in fundAccountList", :key="t.name", :value="t.id", :label="t.name")
              el-form-item(label="上传文件：", prop="fundAccountSerialFile")
                el-upload(drag, :action="action", multiple, ref="fundAccountSerialUpload", accept=".xlsx", :data="uploadData", :on-change="handleChange", :on-remove="handleRemove", :auto-upload="false", :on-success="success", :headers="headers")
                  i.el-icon-upload
                  .el-upload__text 将文件拖到此处，或
                    em 点击上传
                  .el-upload__tip(slot="tip") 只能上传Excel文件
    .bottom-buttons
      el-button(type="primary", size="small", @click="submitForm") 上传
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  dictsUpholdFundAccount
} from '@/common/resource.js'

export default {
  methods: {
    submitForm() {
      this.$refs.fundAccountSerialForm.validate((valid) => {
        if (valid) {
          this.upload()
        }
      })
    },
    getFundAccountList() {
      dictsUpholdFundAccount.post().then(res => {
        const data = res.data
        this.fundAccountList = data.data.dicts
      })
    },

    upload() {
      this.$refs.fundAccountSerialUpload.submit()
    },

    cancel() {
      this.$confirm('内容尚未保存，确定取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },

    handleChange(file, fileList) {
      this.fileList = fileList
      this.$refs.fundAccountSerialForm.validateField('fundAccountSerialFile')
    },

    handleRemove(file, fileList) {
      this.fileList = fileList
      this.$refs.fundAccountSerialForm.validateField('fundAccountSerialFile')
    },

    success(data) {
      this.operationStatus(data)
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
    this.getFundAccountList()
  },

  data() {
    return {
      title: '新增资金账户流水',
      fundAccountList: '',
      action: process.env.API_HOST + '/fundManage/uploadFundAccountSerial',
      headers: {
        'x-auth-token': this.$store.getters.token
      },
      rules: {
        fundAccountId: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        fundAccountSerialFile: [{
          required: true,
          validator: (rule, value, callback) => {
            if (this.fileList.length) callback()
            else callback(new Error('请选择文件'))
          },
          trigger: 'change'
        }]
      },
      uploadData: {
        fundAccountId: ''
      },
      fileList: []
    }
  }
}
</script>

<style lang="scss">
.fund-account-serial-upload {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
</style>
