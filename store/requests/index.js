import moment from "moment";

export const actions = {
  setRequests({ commit }, payload) {
    commit("SET_REQUESTS", payload);
  },

  addRequest({ commit }, payload) {
    commit("ADD_REQUEST", payload);
  }
};

export const getters = {
  requestStatus: (state, getters, rootState) => (status) => {
    let statusIndex = rootState.orderStatus.findIndex(
      (el) => el.value === status
    );
    return rootState.orderStatus[statusIndex];
  },

  customerRequestsInWeek: (state) => (_id) => {
    const data = [];
    if (state.list.length) {
      const current = moment();
      const year = current.format("YYYY");
      for (let i = 0; i <= 12; i++) {
        const month = i < 9 ? `0${i + 1}` : i;
        let total = state.list.filter(
          (el) =>
            el.customer._id === _id &&
            moment(el.createdAt).format("YYYY-MM") === `${year}-${month}`
        ).length;
        data.push([`${month}/${year}`, total]);
      }
    }
    return data;
  }
};

export const state = () => ({
  list: []
});

export const mutations = {
  SET_REQUESTS(state, payload) {
    state.list = payload.data;
  },
  ADD_REQUEST(state, payload) {
    state.list.push(payload);
  }
};
