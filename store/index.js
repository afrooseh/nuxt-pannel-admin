import moment from "moment";

export const state = () => ({
  // BASE_API: "http://192.168.100.8:3000",
  BASE_API: "https://dezvw.sse.codesandbox.io/api",
  minimumStock: 10,
  months: [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO"
  ],
  orderStatus: [
    { class: "light", text: "RECEBIDO", value: 0 }, // 'RECEIVED'
    { class: "secondary", text: "NA FILA", value: 1 }, // 'QUEUE'
    { class: "dark", text: "PREPARANDO", value: 2 }, // 'PREPARING'
    { class: "info", text: "SAIU PARA ENTREGA", value: 3 }, // 'OUT_FOR_DELIVERY'
    { class: "success", text: "ENTREGUE", value: 4 }, // 'DELIVERED'
    { class: "danger", text: "CANCELADO", value: 99 } // 'CANCELLED'
    // { text: '', value: '' },
  ],

  unitsOfMeasure: [
    { text: "GRAMA", value: "G" },
    { text: "QUILOGRAMA", value: "KG" },
    { text: "UNIDADE", value: "UN" }
    // { text: "", value: "" }
  ]
});

export const getters = {
  monthStatistics: (state, getters, rootstate) => {
    const current = moment();
    const year = current.format("YYYY");
    const data = [];
    for (let i = 0; i <= 11; i++) {
      let month = i + 1;
      month = i < 9 ? `0${month}` : month;
      let total = rootstate.requests.list.filter(
        (el) => moment(el.createdAt).format("YYYY-MM") === `${year}-${month}`
      ).length;
      data.push([`${state.months[i]}`, total]);
    }
    return data;
  },

  flowStatistics: (state, getters, rootState) => {
    const current = moment();
    const year = current.format("YYYY");
    let expense = [],
      recipe = [];

    for (let i = 0; i <= 11; i++) {
      let month = i + 1;
      let date = i < 9 ? `${year}-0${month}` : `${year}-${month}`;
      let t = state.months[i];
      expense.push([
        `${state.months[i]}`,
        getters.totalFlowByMonth(date, "DESPESA")
      ]);
      recipe.push([
        `${state.months[i]}`,
        getters.totalFlowByMonth(date, "RECEITA")
      ]);
    }

    return [
      { name: "DESPESA", data: expense },
      { name: "RECEITA", data: recipe }
    ];
  },

  totalFlowByMonth: (state, getters, rootState) => (date, category) => {
    let total = 0;
    const data = rootState.flow.list.filter(
      (el) =>
        moment(el.date).format("YYYY-MM") === date && el.category === category
    );
    data.forEach((el) => (total += el.value));
    return total;
  },

  baseApi: (state) => {
    return state.BASE_API;
  }
};
