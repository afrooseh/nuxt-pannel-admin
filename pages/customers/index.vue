<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <h4>CLIENTES</h4>
        <b-table responsive :items="customers" :fields="fields"> </b-table>
      </b-col>
      <!-- <b-col>
        <pre>{{ JSON.stringify(chartData, null, 2) }}</pre>
      </b-col> -->
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      fields: [
        { key: "name", label: "NOME" },
        { key: "phone", label: "TELEFONE" },
        { key: "test" },
      ],
    };
  },
  computed: {
    ...mapGetters("requests", ["customerRequestsInWeek"]),
    ...mapState({
      customers: (state) => state.customer.list,
      requests: (state) => state.customer.list,
    }),

    chartData() {
      const format = "DD";
      let data = [];
      let start = this.$moment().day(0).format(format),
        end = this.$moment().day(6).format(format);
      for (let i = start; i <= end; i++) {
        data.push([`${i}`, 0]);
      }
      console.log(start, end);
      return data;
    },
  },
};
</script>

<style>
</style>