export const state = () => ({
  list: [
    {
      _id: 0,
      category: {
        _id: "5f972827a366da9f5293aa19",
        acceptsIngredients: true,
        products: [],
        name: "LANCHE",
        createdAt: "2020-10-26T19:48:55.482Z",
        updatedAt: "2020-10-26T20:02:03.275Z",
        __v: 0
      },
      ingredients: [
        {
          _id: "5f95ddd9d789469378e9a566",
          name: "OVO",
          purchase: {
            value: 0.3,
            quantity: 30,
            unit: "UNI"
          },
          sale: {
            value: 0.9,
            quantity: 1,
            unit: "UNI"
          },
          quantity: 5,
          percent: 200
        }
      ],
      price: 10,
      promotion: "NÃO",
      promotionCondition: {
        type: ""
      },
      name: "X-EGG",
      quantity: 0
    },
    {
      _id: 0,
      category: {
        _id: "5f972827a366da9f5293aa19",
        acceptsIngredients: true,
        products: [],
        name: "LANCHE",
        createdAt: "2020-10-26T19:48:55.482Z",
        updatedAt: "2020-10-26T20:02:03.275Z",
        __v: 0
      },
      ingredients: [
        {
          _id: "5f95ddd9d789469378e9a566",
          name: "OVO",
          purchase: {
            value: 0.3,
            quantity: 30,
            unit: "UNI"
          },
          sale: {
            value: 0.9,
            quantity: 1,
            unit: "UNI"
          },
          quantity: 2,
          percent: 200
        }
      ],
      price: 12,
      promotion: "NÃO",
      promotionCondition: {
        type: ""
      },
      name: "X-TUDO",
      quantity: 0
    },
    {
      _id: 0,
      category: {
        _id: "5f972854a366da9f5293aa1a",
        acceptsIngredients: false,
        products: [],
        name: "REFRIGERANTE",
        createdAt: "2020-10-26T19:49:40.330Z",
        updatedAt: "2020-10-26T19:49:40.330Z",
        __v: 0
      },
      ingredients: [
        {
          _id: "5f95ddd9d789469378e9a566",
          name: "OVO",
          purchase: {
            value: 0.3,
            quantity: 30,
            unit: "UNI"
          },
          sale: {
            value: 0.9,
            quantity: 1,
            unit: "UNI"
          },
          quantity: 0,
          percent: 200
        }
      ],
      price: 5.5,
      promotion: "NÃO",
      promotionCondition: {
        type: ""
      },
      name: "ESPORTIVO 2LT",
      quantity: 0
    }
  ]
});

export const actions = {
  setProduct({ commit }, payload) {
    commit("SET_PRODUCT", payload);
  },
  setProducts({ commit }, payload) {
    commit("SET_PRODUCTS", payload);
  }
};

export const mutations = {
  SET_PRODUCT(state, payload) {
    if (payload._id === 0) {
      state.list.push(payload);
    } else {
      const p = state.list.findIndex((el) => el._id === payload._id);
      if (p !== -1) {
        state.list[p] = payload;
      }
    }
  },
  SET_PRODUCTS(state, payload) {
    state.list = payload.data;
  }
};
