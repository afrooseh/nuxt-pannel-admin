// initial state
const state = () => ({
  _id: "5f93c4c7e50830a943a57943",
  startValue: 0
});

// getters
const getters = {
  isOpened: (state) => (state.id !== null ? true : false),
  getCashierID: (state) => state.id
};

// actions
const actions = {
  close({ commit, rootState }) {
    fetch(`${rootState.BASE_API}/cashier/close`)
      .then((res) => res.json())
      .then(() => commit("CLOSE"));
  },

  getCashier({ commit, rootState }) {
    fetch(`${rootState.BASE_API}/cashier`)
      .then((res) => res.json())
      .then((result) => commit("SET_CASHIER", result.cashier));
  },

  open({ commit, rootState }) {
    fetch(`${rootState.BASE_API}/cashier/open`)
      .then((res) => res.json())
      .then((result) => commit("SET_CASHIER", result.cashier));
  }
};

// mutations
const mutations = {
  CLOSE(state) {
    state._id = null;
  },

  OPEN(state) {
    state._id = 1;
  },

  SET_CASHIER(state, cashier) {
    if (cashier !== null) {
      state._id = cashier._id;
      state.startValue = cashier.startValue;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
