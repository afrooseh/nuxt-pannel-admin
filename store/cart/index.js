export const actions = {
  setCartForEdit({ commit }, payload) {
    commit("SET_CART_FOR_EDIT", payload);
  },
  setCustomer({ commit }, payload) {
    commit("SET_CUSTOMER", payload);
  },

  setDeliverIn({ commit }, payload) {
    commit("SET_DELIVERIN", payload);
  },
  setDiscount({ commit }, payload) {},
  addItem({ commit }, payload) {
    commit("ADD_ITEM", payload);
  },
  removeItem({ commit }, payload) {
    commit("REMOVE_ITEM", payload);
  },
  resetCart({ commit }) {
    commit("RESET_CART");
  },
  setMotoboy({ commit }, payload) {
    commit("SET_MOTOBOY", payload);
  },
  setOrderDelivered({ commit }, payload) {
    commit("SET_ORDER_DELIVERED", payload);
  },
  setOrderLeftForDelivery({ commit }, payload) {
    commit("SET_ORDER_LEFT_FOR_DELIVERY", payload);
  },
  setOrderReceived({ commit }, payload) {
    commit("SET_ORDER_RECEIVED", payload);
  },
  // setOrderReceived({commit}, payload) {},
  // setOrderReceived({commit}, payload) {},

  addPaymentMethod({ commit }, method) {
    commit("ADD_PAYMENT_METHOD", method);
  },

  removePaymentMethod({ commit }, index) {
    commit("REMOVE_PAYMENT_METHOD", index);
  }
};

export const getters = {
  subTotal: (state) => {
    let total = 0;

    if (state.items.length) {
      state.items.forEach((item) => {
        total += item.quantity * item.price;
        item.additionals.forEach(
          (add) => (total += add.sale.quantity * add.sale.value * item.quantity)
        );
      });
    }
    return total;
  },

  totalAmount: (state, getters) => {
    let total = 0;
    total += getters.subTotal;

    if (state.deliverIn.taxa) {
      total += state.deliverIn.taxa;
    }

    total -= state.discount;

    return total;
  },

  totalByProduct: (state) => (index) => {
    let allProductsAndAdditionals = 0;
    let oneProductAndAdditionals = 0;

    if (state.items.length) {
      let item = state.items[index];
      console.log(item);
      allProductsAndAdditionals += item.quantity * item.price;
      oneProductAndAdditionals += item.price;
      item.additionals.forEach((add) => {
        allProductsAndAdditionals +=
          add.sale.quantity * add.sale.value * item.quantity;
        oneProductAndAdditionals += add.sale.quantity * add.sale.value;
      });
    }
    return {
      allProductsAndAdditionals,
      oneProductAndAdditionals
    };
  },

  totalItems: (state) => {
    let total = 0;
    total = state.items.length;
    return total;
  }
};

export const state = () => ({
  _id: 0,
  customer: 0,
  deliverIn: {
    taxa: 0
  },
  discount: 0,
  items: [],
  flow: {
    _id: 0,
    date: "",
    category: "",
    reference: "",
    description: "",
    value: 0
  },
  motoboy: undefined,
  orderCancelled: "",
  orderDelivered: "",
  orderLeftForDelivery: "",
  orderReceived: "",
  orderNumber: 0,
  orderStatus: 1,
  orderWaiting: "",
  paymentMethods: [],
  preparingOrder: "",
  taxa: 0,
  total: 0,
  timeOfDeliver: ""
});

export const mutations = {
  ADD_PAYMENT_METHOD(state, method) {
    state.paymentMethods.push(method);
  },

  REMOVE_PAYMENT_METHOD(state, payload) {
    const index = state.paymentMethods.findIndex(
      (p) =>
        p.method === payload.method &&
        p.value === payload.value &&
        p.change === payload.change
    );
    if (index > -1) {
      state.paymentMethods.splice(index, 1);
    }
  },
  SET_CART_FOR_EDIT(state, payload) {
    state._id = payload._id;
    state.customer =
      payload.customer._id !== undefined
        ? payload.customer._id
        : payload.customer;
    state.deliverIn = payload.deliverIn;
    state.discount = payload.discount;
    state.items = payload.items;
    state.flow = payload.flow;
    state.motoboy = payload.motoboy;
    state.orderCancelled = payload.orderCancelled;
    state.orderDelivered = payload.orderDelivered;
    state.orderLeftForDelivery = payload.orderLeftForDelivery;
    state.orderReceived = payload.orderReceived;
    state.orderNumber = payload.orderNumber;
    state.orderStatus = payload.orderStatus;
    state.orderWaiting = payload.orderWaiting;
    state.paymentMethods = payload.paymentMethods;
    state.preparingOrder = payload.preparingOrder;
    state.total = payload.total;
    state.timeOfDeliver = payload.timeOfDeliver;
  },
  SET_CUSTOMER(state, payload) {
    state.customer = payload._id;
  },
  SET_DELIVERIN(state, payload) {
    state.deliverIn = payload;
  },
  SET_DISCOUNT(state, payload) {
    state.discount = payload;
  },
  ADD_ITEM(state, payload) {
    state.items.push(payload);
  },
  REMOVE_ITEM(state, payload) {
    state.items.splice(payload, 1);
  },
  RESET_CART(state) {
    state._id = 0;
    state.customer = 0;
    state.deliverIn = {
      taxa: 0
    };
    state.discount = 0;
    state.items = [];
    state.flow = {
      _id: 0,
      date: "",
      category: "",
      reference: "",
      description: "",
      value: 0
    };
    state.motoboy = undefined;
    state.orderCancelled = "";
    state.orderDelivered = "";
    state.orderLeftForDelivery = "";
    state.orderReceived = "";
    state.orderNumber = 0;
    state.orderStatus = 1;
    state.orderWaiting = "";
    state.paymentMethods = [];
    state.preparingOrder = "";
    state.taxa = 0;
    state.total = 0;
    state.timeOfDeliver = "";
  },
  SET_MOTOBOY(state, payload) {},
  SET_ORDER_DELIVERED(state, payload) {},
  SET_ORDER_LEFT_FOR_DELIVERY(state, payload) {},
  SET_ORDER_RECEIVED(state, payload) {}
};
