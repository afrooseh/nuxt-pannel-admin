// initial state
const state = () => ({
  list: [
    // {
    //   _id: "f98f789f687sdf7sdu0f",
    //   category: "DESPESA",
    //   reference: "",
    //   description: "",
    //   value: 0
    // }
    {
      _id: "f98f789f687sdf7sdu0f",
      category: "DESPESA",
      date: "2020-10-01",
      reference: "ewrewr34r43t",
      description: "COMPRA HAMBURGUER DE CARNE",
      value: 37.87
    }
  ]
});

export const actions = {
  setFlow({ commit }, payload) {
    commit("SET_FLOW", payload.data);
  }
};

export const mutations = {
  SET_FLOW(state, payload) {
    state.list = payload;
  }
};

export default {
  namespaced: true,
  actions,
  mutations,
  state
};
