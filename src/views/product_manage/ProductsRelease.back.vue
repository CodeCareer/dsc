<template lang="pug">
  section.account-list
    .box
      .box-tab-head
        el-button(type="primary", size="small", @click="openAccountDialog()")
          i.iconfont.icon-plus
          | 新增
      .filters
        el-input(placeholder='所属方', icon='search', v-model.lazy='filter.belongto')
        el-input(placeholder='账户名', icon='search', v-model.lazy='filter.name')
        el-input(placeholder='账户', icon='search', v-model.lazy='filter.bankNum')
        el-select(v-model="filter.type", placeholder="账户类型")
          el-option(v-for="t in accountTypes", :key="t.name", :value="t.value", :label="t.name")
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='filterAccounts', style='width: 100%')
        el-table-column(prop='belongto', label='所属方', width='220')
          template(scope='scope')
            el-popover(v-if="scope.row.note", trigger='hover' placement='top')
              p 提示: {{ scope.row.note }}
              .name-wrapper(slot='reference')
                | {{ scope.row.belongto }}
                i.iconfont.icon-explain
            span(v-if="!scope.row.note") {{scope.row.belongto}}
        el-table-column(prop='type', label='账户类型', width='120')
        el-table-column(prop='name', label='账户名', width='220')
        el-table-column(prop='bankNum', label='账户', width='220')
        el-table-column(prop='bank', label='开户行', width='220')
        el-table-column(label='关联产品', width='100')
          template(scope="scope")
            a(@click="openRelationProducts(scope.row)")
              i.iconfont.icon-relation
        el-table-column(prop='updateDate', label='更新时间', width='120')
        el-table-column(label='操作', :fixed="fixed", width='100')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(@click="openAccountDialog(scope.row)")
              i.iconfont.icon-delete(@click.stop="deleteAccount(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='page.current', :page-sizes="page.sizes", :page-size="page.size", layout='total, prev, pager, next, jumper', :total='accounts.length')
    el-dialog(title='关联产品', v-model='relationProductsVisible')
      el-table(:data='relationProducts')
        el-table-column(property='name', label='产品名称', width='200')
        el-table-column(prop="amount", label='存续金额')
        el-table-column(property='platform', label='发行平台')
</template>

<script>
import {
  remove,
  filter,
  mergeWith,
  each,
  find
  // findIndex
} from 'lodash'
import moment from 'moment'

export default {
  methods: {
    tabClick(tab, event) {
      console.log(tab, event)
    },

    clearFilter() {
      each(this.filter, (v, k) => {
        this.filter[k] = ''
      })
    },

    pageChange(val) {
      console.log(`分页${val}`)
    },

    pageSizeChange(val) {
      this.page.size = val
    },

    openAccountDialog(account) {
      this.$refs.accountDialog.open(account)
    },

    openRelationProducts(account) {
      this.relationProducts = account.relationProducts
      this.relationProductsVisible = true
    },

    onAccountSave(account) {
      const activeAccount = find(this.accounts, v => v.id === account.id)
      if (activeAccount) {
        account.updateDate = moment().format('YYYY-MM-DD')
        mergeWith(activeAccount, account)
      } else {
        this.accounts.unshift(account)
      }
    },

    deleteAccount(account) {
      this.$msgbox.confirm('账户删除后将无法再使用，确认删除？', '提示', {
        type: 'warning'
      }).then(() => {
        this.accounts = remove(this.accounts, (v) => {
          return account.id !== v.id
        })
      })
    }
  },

  computed: {
    filterAccounts() {
      return filter(this.accounts, v => {
        return ~v.belongto.indexOf(this.filter.belongto) && ~v.name.indexOf(this.filter.name) && ~v.bankNum.indexOf(this.filter.bankNum) && ~v.type.indexOf(this.filter.type)
      })
    }
  },

  data() {
    return {
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      tab: 'first',
      relationProductsVisible: false,
      relationProducts: [],
      filter: {
        belongto: '',
        name: '',
        bankNum: '',
        type: ''
      },
      page: {
        current: 1,
        size: 10,
        sizes: [10, 20, 30, 50]
      },
      accountTypes: [{
        name: '募集账户',
        value: '募集账户'
      }, {
        name: '产品账户',
        value: '产品账户'
      }, {
        name: '资产账户',
        value: '资产账户'
      }, {
        name: '费用账户',
        value: '费用账户'
      }, {
        name: '其他第三方账户',
        value: '其他第三方账户'
      }],
      accounts: [{
        id: 1,
        belongto: '恒大金服有限公司',
        type: '募集账户',
        name: '恒大金服有限公司',
        bankNum: '0967 8022 6182 299',
        bank: '杭州银行股份有限公司南京河支行',
        updateDate: '2016-03-10',
        relationProducts: [{
          id: 1,
          name: '粤股交丰银宝理财计划A',
          amount: '￥ 78,613,007.00',
          platform: '京东金融'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 2,
        belongto: '广东金融高新区股权交易中心',
        type: '产品账户',
        name: '广东金融高新区股权交易中心',
        bankNum: '0200 0033 2925 001012',
        bank: '中国工商银行北京市长安支行',
        updateDate: '2016-04-01',
        relationProducts: [{
          id: 1,
          name: '粤股交丰银宝理财计划A',
          amount: '￥ 78,613,007.00',
          platform: '京东金融'
        }, {
          id: 3,
          name: '“智鑫1号”理财计划',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 3,
        belongto: '京东金融有限公司',
        type: '募集账户',
        name: '京东金融有限公司',
        bankNum: '1101 3875 7940 002',
        bank: '平安银行北京亚运村支行',
        updateDate: '2016-05-19',
        relationProducts: [{
          id: 4,
          name: '“润鑫1号”理财计划',
          amount: '￥ 78,613,007.00',
          platform: '360你财富'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 4,
        belongto: '国美在线有限公司',
        type: '募集账户',
        name: '国美在线有限公司',
        bankNum: '8701 9981 0981 736',
        bank: '广发银行北京三元桥支行',
        updateDate: '2016-06-10',
        relationProducts: [{
          id: 5,
          name: '京禾宝理财计划',
          amount: '￥ 78,613,007.00',
          platform: '途牛金服'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 5,
        belongto: '途牛金服有限公司',
        type: '募集账户',
        name: '途牛金服有限公司',
        bankNum: '4352 3892 6713 011',
        bank: '交通银行北京马甸桥支行',
        updateDate: '2016-07-01',
        relationProducts: [{
          id: 1,
          name: '粤股交丰银宝理财计划A',
          amount: '￥ 78,613,007.00',
          platform: '京东金融'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 6,
        belongto: '天津旭达有限公司',
        type: '资产账户',
        name: '天津旭达有限公司',
        bankNum: '2310 8372 6532 098',
        bank: '招商银行天津滨海新区支行',
        updateDate: '2016-08-19',
        relationProducts: [{
          id: 1,
          name: '粤股交丰银宝理财计划A',
          amount: '￥ 78,613,007.00',
          platform: '京东金融'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 7,
        belongto: '江苏开汇资产管理有限公司',
        type: '资产账户',
        name: '江苏开汇资产管理有限公司',
        bankNum: '4367 8022 6182 200',
        bank: '杭州银行股份有限公司南京河支行',
        updateDate: '2016-09-19',
        relationProducts: [{
          id: 1,
          name: '粤股交丰银宝理财计划A',
          amount: '￥ 78,613,007.00',
          platform: '京东金融'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 8,
        belongto: '天翼电子商务有限公司',
        type: '募集账户',
        name: '天翼电子商务有限公司客户备付金',
        bankNum: '0033 2925 0000 532',
        bank: '中国工商银行北京市长安支行',
        updateDate: '2016-10-10',
        relationProducts: [{
          id: 1,
          name: '粤股交丰银宝理财计划A',
          amount: '￥ 78,613,007.00',
          platform: '京东金融'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 9,
        belongto: '深圳前海子午金融服务有限公司',
        type: '募集账户',
        name: '深圳前海子午金融服务有限公司',
        bankNum: '1101 4805 7940 002',
        bank: '平安银行天津北辰支行',
        updateDate: '2016-07-08',
        relationProducts: [{
          id: 1,
          name: '粤股交丰银宝理财计划A',
          amount: '￥ 78,613,007.00',
          platform: '京东金融'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }, {
        id: 10,
        belongto: '北京永丰金融信息服务有限公司',
        type: '募集账户',
        name: '北京北陀资产管理有限公司',
        bankNum: '8701 9981 0981 736',
        bank: '渤海银行北京三元桥支行',
        updateDate: '2016-08-25',
        relationProducts: [{
          id: 1,
          name: '粤股交丰银宝理财计划A',
          amount: '￥ 78,613,007.00',
          platform: '京东金融'
        }, {
          id: 2,
          name: '粤股交丰银宝理财计划B',
          amount: '￥ 80,533,201.00',
          platform: '京东金融'
        }]
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  margin-top: 20px;
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
  .icon-relation {
    font-size: 15px;
  }
}
.box-tab-head{
  text-align: right;
    background: #f3f6f8;
    height: 40px;
    line-height: 40px;
    padding-right: 15px;
}
</style>
