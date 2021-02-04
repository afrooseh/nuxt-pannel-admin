export const actions = {
  addOrEditCustomer({ commit }, payload) {
    commit("SET_CUSTOMER", payload);
  },
  setCustomers({ commit }, payload) {
    commit("SET_CUSTOMERS", payload);
  }
};

export const state = () => ({
  list: [
    {
      _id: "5f9bf0cf2ebe931614cefdec",
      addresses: [
        {
          zip_code: "75902-886",
          street: "Rua L - 5",
          number: 937,
          neighborhood: "Lindolfina",
          city: "Rio Verde",
          state: "GO",
          taxa: 0
        }
      ],
      name: "César Ruan Cauã da Mata",
      nivel: "customer",
      phone: "(64) 98705-1790",
      __v: 6,
      createdAt: "2020-10-30T11:13:23.111Z",
      requests: [
        "5f9bfceb3a2f755453113e6d",
        "5f9bff0d6a50c4561df553d1",
        "5f9c02126a50c4561df553d3",
        "5f9c02726a50c4561df553d4"
      ],
      updatedAt: "2020-10-30T12:09:22.443Z"
    },
    {
      _id: "5f9bf21c2ebe931614cefded",
      addresses: [
        {
          zip_code: "40040-355",
          street: "Ladeira do Prata",
          number: 507,
          neighborhood: "Nazaré",
          city: "Salvador",
          state: "BA",
          taxa: 0
        }
      ],
      name: "Henry Lucca da Paz",
      nivel: "customer",
      phone: "(71) 99469-7822",
      __v: 3,
      createdAt: "2020-10-30T11:16:53.902Z",
      requests: [
        "5f9bf625e619444ae2ccdd0d",
        "5f9c000d6a50c4561df553d2",
        "5f9c03a3c150bf591160cf1a"
      ],
      updatedAt: "2020-10-30T12:14:27.096Z"
    }
  ]
});

export const mutations = {
  SET_CUSTOMER(state, payload) {
    if (payload._id > 0) {
      let search = state.list.findIndex((el) => el._id === payload._id);
      if (search !== -1) {
        state.list[search] = payload;

        console.clear();
        console.log("PAYLOAD", search, payload);
      }
    } else {
      payload._id = state.list.length + 1;
      state.list.push(payload);
    }
  },
  SET_CUSTOMERS(state, payload) {
    console.log(payload.payload);
    state.list = payload.data;
  }
};
