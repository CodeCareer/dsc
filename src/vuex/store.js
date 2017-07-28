import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
import 'core-js/fn/promise' // for vuex

const state = {
  user: JSON.parse(window.localStorage.user || '{}') || {},
  token: window.localStorage.token
}

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  mutations,
  actions
})

export default store
