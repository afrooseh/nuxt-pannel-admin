// initial state
const state = () => ({
  list: [
    {
      _id: "5f9b932d9feaae1b61abde15",
      acceptsIngredients: true,
      products: ["5f9bf532e619444ae2ccdd08"],
      name: "LANCHE",
      createdAt: "2020-10-30T04:14:37.022Z",
      updatedAt: "2020-10-30T11:12:50.655Z",
      __v: 1
    },
    {
      _id: "5f9b968e9feaae1b61abde16",
      acceptsIngredients: false,
      products: ["5f9bf603e619444ae2ccdd0c"],
      name: "REFRIGERANTE",
      createdAt: "2020-10-30T04:29:02.317Z",
      updatedAt: "2020-10-30T11:16:19.577Z",
      __v: 1
    }
  ]
});

// getters
const getters = {};

// actions
const actions = {
  setCategories({ commit }, payload) {
    commit("SET_CATEGORIES", payload);
  }
};

// mutations
const mutations = {
  SET_CATEGORIES(state, payload) {
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
