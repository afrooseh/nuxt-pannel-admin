// initial state
const state = () => ({
  list: [
    {
      _id: "5f95ddd9d789469378e9a566",
      name: "OVO",
      purchase: { value: 0.3, quantity: 30, unit: "UNI" },
      sale: {
        value: 0.8,
        quantity: 1,
        unit: "UN"
      },
      stock: 30
    }
  ]
});

// getters
const getters = {};

// actions
const actions = {
  setIngredients({ commit }, payload) {
    commit("SET_INGREDIENTS", payload);
  }
};

// mutations
const mutations = {
  SET_INGREDIENTS(state, payload) {
    state.list = payload.data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
