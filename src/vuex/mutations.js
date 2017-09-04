export default {
  updateUser: function(state, user) {
    state.user = user
  },

  updateToken(state, token) {
    state.token = token
  },

  updateOrgId(state, orgId) {
    state.orgId = orgId
  },

  updatePermissions(state, permissions) {
    state.permissions = permissions
  }
}
