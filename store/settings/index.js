// initial state
const state = () => ({
  cnpj: "00000000000000"
});

// getters
const getters = {};

// actions
const actions = {
  setSettings({ commit }, payload) {
    commit("SET_SETTINGS", payload.data);
  }
};

// mutations
const mutations = {
  SET_SETTINGS(state, payload) {
    const { cnpj } = payload;

    state.cnpj = cnpj;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
