<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <h4>INGREDIENTES</h4>
        <b-table
          bordered
          hover
          outlined
          responsive
          striped
          :fields="fields"
          :items="ingredients"
        >
          <template #cell(value)="data">
            {{ $money(data.item.sale.value) }}
          </template>
          <template #cell(expirationDate)="data">
            {{ $moment(data.item.expirationDate).format("DD/MM/YYYY") }}
          </template>
          <template #cell(actions)="data">
            <b-icon-pencil
              style="cursor: pointer !important"
              :id="'tooltip-pencil-target-' + data.index"
              @click="editIngredient(data.item)"
            ></b-icon-pencil>
            <b-tooltip
              :target="'tooltip-pencil-target-' + data.index"
              triggers="hover"
              >EDITAR INGREDIENTE</b-tooltip
            >
          </template>
        </b-table>
      </b-col>
      <b-col cols="12">
        <b-button
          @click="
            modal.show = true;
            modal.edit = false;
          "
          >NOVO</b-button
        >

        <b-modal
          v-model="modal.show"
          size="lg"
          centered
          no-close-on-esc
          no-close-on-backdrop
          @close="reset"
          :title="modal.edit ? 'EDITAR INGREDIENTE' : 'NOVO INGREDIENTE'"
        >
          <b-row fluid>
            <b-col cols="12" sm="6" md="4">
              <b-form-group id="fg-id" label="ID" label-for="_id">
                <b-form-input
                  id="_id"
                  v-model="modal.form._id"
                  type="text"
                  disabled
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="12" sm="6" md="5">
              <b-form-group id="fg-name" label="NOME" label-for="name">
                <b-form-input
                  id="name"
                  v-model="modal.form.name"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="12" sm="6" md="3">
              <b-form-group id="fg-stock" label="ESTOQUE" label-for="stock">
                <b-form-input
                  v-model="modal.form.stock"
                  type="text"
                  disabled
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" sm="6" md="2">
              <VueMoney
                id="sale-value"
                label="PREÇO"
                v-model="modal.form.sale.value"
              />
            </b-col>
            <b-col cols="12" sm="6" md="2">
              <b-form-group
                id="fg-sale.quantity"
                label="QUANTIDADE"
                label-for="sale.quantity"
              >
                <b-form-input
                  v-model="modal.form.sale.quantity"
                  :type="$device.isDesktop ? 'number' : 'tel'"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="12" sm="6" md="4">
              <b-form-group
                id="fg-sale.unit"
                label="UNIDADE DE MEDIDA"
                label-for="sale.unit"
              >
                <b-form-select
                  v-model="modal.form.sale.unit"
                  :options="unitsOfMeasure"
                ></b-form-select> </b-form-group
            ></b-col>
            <b-col>
              <b-form-group label="VALIDADE">
                <date-picker
                  v-model="modal.form.expirationDate"
                  valueType="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                ></date-picker>
              </b-form-group>
            </b-col>
            <b-col cols="12" v-if="modal.form._id != 0">
              <b-button variant="success">LANÇAR ESTOQUE</b-button>
            </b-col>
          </b-row>
          <template v-slot:modal-footer>
            <b-button
              v-if="modal.form.name"
              variant="success"
              class="rounded-0"
              @click="sendForm"
              >SALVAR</b-button
            >
            <b-button variant="danger" class="rounded-0" @click="reset"
              >CANCELAR</b-button
            >
          </template>
        </b-modal>
      </b-col>
      <b-col cols="12">
        <pre>{{ JSON.stringify(modal.form, null, 2) }}</pre>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

import VueMoney from "../../components/vue-money";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/pt-br";
import "vue2-datepicker/index.css";

export default {
  components: {
    DatePicker,
    VueMoney,
  },
  head() {
    return {
      title: "INGREDIENTES",
    };
  },

  data() {
    return {
      showDatepicker: true,
      example: {
        _id: 0,
        name: "",
        purchase: {
          value: 0,
          quantity: 0,
          unit: "",
        },
        sale: {
          value: 0,
          quantity: 0,
          unit: "",
        },
        stock: 0,
      },
      fields: [
        {
          label: "NOME",
          align: "start",
          sortable: false,
          key: "name",
        },
        {
          label: "VALOR UNIT.",
          align: "start",
          sortable: false,
          key: "value",
        },
        {
          label: "UNID.",
          key: "sale.unit",
        },
        {
          label: "ESTOQUE",
          key: "stock",
        },
        {
          label: "VALIDADE",
          key: "expirationDate",
        },
        {
          label: "",
          align: "start",
          sortable: false,
          key: "actions",
        },
      ],
      modal: {
        edit: false,
        form: {
          sale: {
            value: 0,
          },
        },
        show: false,
      },
    };
  },

  computed: {
    ...mapState({
      ingredients: (state) => state.ingredients.list,
      unitsOfMeasure: (state) => state.unitsOfMeasure,
    }),
  },

  methods: {
    ...mapActions("flow", ["setFlow"]),

    editIngredient(item) {
      this.modal.form = JSON.parse(JSON.stringify({ ...item }));
      this.modal.edit = true;
      this.modal.show = true;
    },

    reset() {
      this.modal.edit = false;
      this.modal.show = false;
      this.modal.form = JSON.parse(JSON.stringify({ ...this.example }));
    },

    sendForm() {
      // this.setFlow({
      //   _id: "f98f789f687sdf7sdu0f",
      //   category: "RECEITA",
      //   reference: "f98yffd78gy98y984",
      //   description: "Venda de produtos",
      //   value: this.total,
      // });
      fetch(`http://localhost:3000/ingredients`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.modal.form),
      }).then((resp) => {
        this.$getAllIngredients();
        this.reset();
      });
    },
  },

  mounted() {
    this.reset();
  },
};
</script>

<style>
</style>