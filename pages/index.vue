<template>
  <b-container>
    <b-row>
      <div class="col-sm-4 mb-3">
        <div class="card bg-purple text-white">
          <div class="card-body">
            <h5>CARTÃO DE CRÉDITO</h5>
            <h3 class="mb-0">{{ tiles_values.totalCreditCard }}</h3>
          </div>
        </div>
      </div>

      <div class="col-sm-4 mb-3">
        <div class="card bg-dark text-white">
          <div class="card-body">
            <h5>CARTÃO DÉBITO</h5>
            <h3 class="mb-0">{{ tiles_values.totalDebitCard }}</h3>
          </div>
        </div>
      </div>
      <div class="col-sm-4 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5>DINHEIRO</h5>
            <h3 class="mb-0">{{ tiles_values.totalMoney }}</h3>
          </div>
        </div>
      </div>
      <div class="col-sm-4 mb-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h5>TAXA</h5>
            <h3 class="mb-0">{{ tiles_values.totalTaxa }}</h3>
          </div>
        </div>
      </div>
      <div class="col-sm-4 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h5>RECEITAS</h5>
            <h3 class="mb-0">{{ $money(tiles_values.totalRevenue) }}</h3>
          </div>
        </div>
      </div>
      <div class="col-sm-4 mb-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <h5>DESPESAS</h5>
            <h3 class="mb-0">{{ $money(tiles_values.totalExpenses) }}</h3>
          </div>
        </div>
      </div>
      <b-col cols="12">
        <b-button @click="addFlow">LANÇAR MOVIMENTAÇÃO</b-button>
        <b-modal v-model="modal.show" title="LANÇAR MOVIMENTAÇÃO" scrollable>
        </b-modal>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" sm="6" class="mt-4">
        <h4>ESTATÍSTICA MENSAL - CAIXA</h4>
        <line-chart
          :colors="['#b00', '#008000']"
          :discrete="true"
          :data="flowStatistics"
          prefix="R$"
          decimal=","
          :zeros="true"
          :round="2"
        ></line-chart>
      </b-col>
      <b-col cols="12" sm="6" class="mt-4">
        <h4>ESTATÍSTICA MENSAL - PEDIDOS</h4>
        <line-chart :discrete="true" :data="monthStatistics"></line-chart>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" class="mt-4">
        <h4>MOVIMENTAÇÃO DO CAIXA</h4>
        <b-table
          bordered
          :fields="fields"
          :items="flow"
          :tbody-tr-class="rowClass"
          responsive
        >
          <template #cell(value)="data"
            >{{ $money(data.item.value) }}
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>



<style>
.bg-purple {
  background-color: purple !important;
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  head() {
    return {
      title: "CAIXA",
    };
  },
  computed: {
    ...mapGetters(["monthStatistics", "flowStatistics"]),
    ...mapState({
      BASE_API: (state) => state.BASE_API,
      cashier: (state) => state.cashier,
      user: (state) => state.auth.user,
      requests: (state) => state.requests.list,
      flow: (state) => state.flow.list,
    }),

    tiles_values() {
      let totalDebitCard = 0,
        totalCreditCard = 0,
        totalMoney = 0,
        totalTaxa = 0,
        totalRequests = 0,
        totalExpenses = 0,
        totalRevenue = 0;
      if (this.cashier._id !== 0 && this.requests.length) {
        let cashier_requests = this.requests.filter(
          (req) => req.cashier === this.cashier._id
        );
        cashier_requests.forEach((req) => {
          totalTaxa += req.deliverIn.taxa;
          req.paymentMethods.forEach((pm) => {
            if (pm.method === "CARTÃO DE DÉBITO") {
              totalDebitCard += pm.value;
            }
            if (pm.method === "CARTÃO DE CRÉDITO") {
              totalCreditCard += pm.value;
            }
            if (pm.method === "DINHEIRO") {
              totalMoney += pm.value - pm.change;
              console.log(pm.value - pm.change);
            }
          });
        });
        totalRequests += cashier_requests.length;
      }

      this.flow.forEach((el) => {
        if (el.category === "DESPESA") {
          totalExpenses -= el.value;
        }
        if (el.category === "RECEITA") {
          totalRevenue += el.value;
        }
      });
      // totalExpenses = this.$money(totalExpenses);

      totalDebitCard = this.$money(totalDebitCard);
      totalCreditCard = this.$money(totalCreditCard);
      totalMoney = this.$money(totalMoney);
      totalTaxa = this.$money(totalTaxa);

      return {
        totalCreditCard,
        totalDebitCard,
        totalExpenses,
        totalMoney,
        totalTaxa,
        totalRequests,
        totalRevenue,
      };
    },
  },

  data() {
    return {
      fields: [
        { key: "category", label: "CATEGORIA" },
        { key: "description", label: "DESCRIÇÃO" },
        { key: "value", label: "VALOR" },
      ],
      modal: {
        form: {},
        show: false,
      },
    };
  },

  methods: {
    addFlow() {
      this.modal.show = true;
    },
    rowClass(item, type) {
      if (item && type === "row") {
        if (item.category === "DESPESA") {
          return "bg-danger text-white";
        } else {
          return "bg-success text-white";
        }
      } else {
        return null;
      }
    },
  },

  mounted() {
    let profit =
      parseFloat(this.tiles_values.totalRevenue) -
      parseFloat(this.tiles_values.totalExpenses);
    let profitMargin =
      (parseFloat(profit) / parseFloat(this.tiles_values.totalRevenue)) * 100;
    // console.clear();
    // console.log(this.flowStatistics);
    // console.log(
    //   this.tiles_values.totalRevenue.toFixed(2),
    //   (parseFloat(profit) / parseFloat(this.tiles_values.totalRevenue)) * 100
    // );
    // console.log(profit.toFixed(2), profitMargin.toFixed(2));

    this.$getFlow();
  },
};
</script>

