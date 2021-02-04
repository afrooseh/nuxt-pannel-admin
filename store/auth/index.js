const state = () => ({
  isLogged: false,
  token: null,
  user: null
});

const getters = {};

const actions = {
  doLogin({ commit }, payload) {
    commit("LOGIN", payload);
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: payload._id,
        email: payload.email,
        name: payload.name,
        nivel: payload.nivel
      })
    );
    localStorage.setItem("token", payload.token);
  },

  doLogout({ commit }) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    commit("LOGOUT");
  },

  setToken({ commit }, token) {
    commit("SET_TOKEN", token);
  },

  setUser({ commit }, user) {
    commit("SET_USER", user);
  }
};

const mutations = {
  LOGIN(state, payload) {
    state.isLogged = true;
    state.token = payload.token;
    state.user = {
      _id: payload._id,
      email: payload.email,
      name: payload.name,
      nivel: payload.nivel
    };
  },

  LOGOUT(state) {
    state.isLogged = false;
    state.token = null;
    state.user = null;
  },

  SET_TOKEN(state, token) {
    state.token = token;
  },

  SET_USER(state, user) {
    state.user = user;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
