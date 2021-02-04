import moment from "moment";

export default (context, inject) => {
  let { store } = context;

  console.log();

  // FLOW
  const getFlow = (_) => {
    const date = moment().format("YYYY-MM-DD");
    fetch(`${store.getters.baseApi}/flow?date=${date}`)
      .then((resp) => resp.json())
      .then((json) => {
        store.dispatch("flow/setFlow", {
          data: json.flows,
          context
        });
      });
  };

  inject("getFlow", getFlow);

  // CATEGORIES
  const getAllCategories = (_) => {
    fetch(`${store.getters.baseApi}/categories`)
      .then((resp) => resp.json())
      .then((json) => {
        store.dispatch("categories/setCategories", {
          data: json.categories,
          context
        });
      });
  };

  inject("getAllCategories", getAllCategories);

  // CUSTOMERS
  const getAllCustomers = (_) => {
    fetch(`${store.getters.baseApi}/users`)
      .then((resp) => resp.json())
      .then((json) => {
        store.dispatch("customer/setCustomers", {
          data: json,
          context
        });
      });
  };

  inject("getAllCustomers", getAllCustomers);

  // INGREDIENTS
  const getAllIngredients = (_) => {
    fetch(`${store.getters.baseApi}/ingredients`)
      .then((resp) => resp.json())
      .then((json) => {
        store.dispatch("ingredients/setIngredients", {
          data: json.ingredients,
          context
        });
      });
  };
  inject("getAllIngredients", getAllIngredients);

  // PRODUCTS
  const getAllProducts = (_) => {
    fetch(`${store.getters.baseApi}/products`)
      .then((resp) => resp.json())
      .then((json) => {
        store.dispatch("products/setProducts", {
          data: json.products,
          context
        });
      });
  };
  inject("getAllProducts", getAllProducts);

  // REQUESTS
  const getAllRequests = (_) => {
    fetch(`${store.getters.baseApi}/requests`)
      .then((resp) => resp.json())
      .then((json) => {
        store.dispatch("requests/setRequests", {
          data: json.requests,
          context
        });
      });
  };
  inject("getAllRequests", getAllRequests);

  // FORMAT MONEY
  const money = (value) => {
    if (value === undefined) {
      value = 0;
    }
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };
  // Inject $hello(msg) in Vue, context and store.
  inject("money", money);
  // For Nuxt <= 2.12, also add 👇
  context.$money = money;
};
