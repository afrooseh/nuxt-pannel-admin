<template>
  <b-container>
    <b-row class="mb-3">
      <b-col cols="12">
        <p class="font-weight-bold">CLIENTE</p>
      </b-col>
      <b-col cols="12" sm="3">
        <b-form-group id="customer" label="ID" label-for="_id">
          <b-form-input
            id="_id"
            v-model="cart.customer"
            type="text"
            disabled
          ></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="4">
        <label class="typo__label" ref="labve">TELEFONE</label>
        <multiselect
          :options="customers"
          v-model="selectedCustomer"
          label="phone"
          V-mask="['(##) ####-####', '(##) #####-####']"
          placeholder="SELECIONE UM CLIENTE"
          :allow-empty="false"
          :showLabels="false"
          track-by="_id"
          @input="selectCustomer"
        >
        </multiselect>
      </b-col>
      <b-col cols="12" sm="5"
        ><label class="typo__label">NOME</label>
        <multiselect
          v-model="selectedCustomer"
          label="name"
          placeholder="SELECIONE UM CLIENTE"
          :options="customers"
          :allow-empty="false"
          :showLabels="false"
          track-by="_id"
          @input="selectCustomer"
        >
        </multiselect>
      </b-col>
      <b-col cols="12">
        <p class="font-weight-bold">ENDEREÇO DE ENTREGA</p>
        <b-table
          ref="tabla"
          selectable
          striped
          hover
          responsive
          bordered
          :fields="fields"
          :items="selectedCustomer.addresses"
          select-mode="single"
          @row-selected="onRowSelected"
        >
          <template #cell(selected)="{ rowSelected }">
            <template v-if="rowSelected">
              <span aria-hidden="true">&check;</span>
              <span class="sr-only">Selected</span>
            </template>
            <template v-else>
              <span aria-hidden="true">&nbsp;</span>
              <span class="sr-only">Not selected</span>
            </template>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row
      v-if="
        JSON.stringify(form.deliverIn) !== JSON.stringify(example.deliverIn)
      "
    >
      <b-col cols="12" sm="3">
        <b-form-group label="ENTREGAR ÀS">
          <b-form-input type="time" v-model="form.timeOfDeliver"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="3">
        <VueMoney label="TAXA" v-model="form.deliverIn.taxa" />
      </b-col>
      <b-col cols="12">
        <p class="font-weight-bold">PAGAMENTO</p>
      </b-col>
      <b-col cols="12" sm="3">
        <VueMoney label="DESCONTO" v-model="form.discount" />
      </b-col>
      <b-col cols="12" sm="3">
        <VueMoney label="TOTAL" disabled v-model="total" />
      </b-col>
      <b-col cols="12" sm="3">
        <VueMoney label="RESTANTE" disabled v-model="rest" />
      </b-col>
      <b-col cols="12">
        <b-table
          bordered
          responsive
          :fields="[
            { key: 'method', label: 'MÉTODO' },
            { key: 'value', label: 'VALOR' },
            { key: 'change', label: 'TROCO' },
            { key: 'actions', label: '' },
          ]"
          :items="form.paymentMethods"
        >
          <template #cell(value)="data">
            {{ $money(data.value) }}
          </template>
          <template #cell(change)="data">
            {{ $money(data.value) }}
          </template>
          <template #cell(actions)="data">
            <b-icon-trash
              style="cursor: pointer !important"
              @click="removePaymentMethod(data.item)"
            ></b-icon-trash>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12" sm="4" v-if="!paymentMethodsTotal">
        <b-form-group label="MÉTODO">
          <b-form-select
            v-model="paymentMethod.method"
            :options="['CARTÃO DE DÉBITO', 'CARTÃO DE CRÉDITO', 'DINHEIRO']"
            @change="getChangeOfMoney"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="3" v-if="paymentMethod.method !== ''">
        <VueMoney
          label="VALOR"
          v-model="paymentMethod.value"
          @input="setChange"
        />
      </b-col>
      <b-col
        cols="12"
        sm="3"
        v-if="
          paymentMethod.method !== '' && paymentMethod.method === 'DINHEIRO'
        "
      >
        <VueMoney label="TROCO" v-model="paymentMethod.change" disabled />
      </b-col>
      <b-col cols="12" sm="4" v-if="paymentMethodValue">
        <b-button @click="setPaymentMethod">ADICIONAR</b-button>
      </b-col>
      <b-col cols="12">
        <p class="font-weight-bold">OUTROS</p>
      </b-col>
      <b-col cols="12" sm="3">
        <b-form-group id="orderStatus" label="STATUS" label-for="orderStatus">
          <b-form-select
            id="orderStatus"
            v-model="form.orderStatus"
            :options="orderStatus"
            placeholder=""
          >
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-navbar variant="dark" type="dark" fixed="bottom">
      <b-navbar-nav>
        <b-button
          class="mr-1"
          v-if="cart.customer == 0"
          variant="primary"
          @click="
            modal.editCustomer = false;
            modal.show = true;
          "
          >CADASTRAR CLIENTE</b-button
        >

        <b-button
          class="mr-1"
          v-if="selectedCustomer._id"
          variant="primary"
          @click="
            modal.editCustomer = true;
            modal.show = true;
          "
          >EDITAR CLIENTE</b-button
        >
        <b-button
          class="mr-1"
          v-if="selectedCustomer._id"
          variant="warning"
          dark
          @click="reset"
          >LIMPAR</b-button
        >
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-button variant="danger" class="mr-1" @click="cancel"
          >CANCELAR {{ cart._id !== 0 ? "EDIÇÃO" : "VENDA" }}</b-button
        >
        <b-button variant="success" v-if="cart.customer !== 0" @click="finish"
          >FINALIZAR {{ cart._id !== 0 ? "EDIÇÃO" : "VENDA" }}</b-button
        >
      </b-navbar-nav>
    </b-navbar>
    <b-modal
      v-model="modal.show"
      :title="modal.editCustomer ? 'EDITAR CLIENTE' : 'CADASTRAR CLIENTE'"
      scrollable
    >
      <b-row class="mb-3">
        <b-col cols="12" sm="3">
          <b-form-group id="customer" label="ID" label-for="_id">
            <b-form-input
              id="_id"
              v-model="modal.form._id"
              type="text"
              disabled
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="5">
          <b-form-group id="name" label="NOME" label-for="name">
            <b-form-input
              id="name"
              v-model="modal.form.name"
              type="text"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="4">
          <b-form-group id="phone" label="TELEFONE" label-for="phone">
            <the-mask
              class="form-control"
              :mask="['(##) ####-####', '(##) #####-####']"
              id="phone"
              v-model="modal.form.phone"
              type="tel"
              :masked="true"
            ></the-mask>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row
        v-for="(editAddress, addressIndex) in modal.form.addresses"
        :key="addressIndex"
      >
        <b-col cols="12" sm="5">
          <b-form-group id="zip_code" label="CEP" label-for="zip_code">
            <b-input-group>
              <the-mask
                class="form-control"
                mask="#####-###"
                id="zip_code"
                v-model="modal.form.addresses[addressIndex].zip_code"
                type="tel"
                :masked="true"
              ></the-mask>

              <b-input-group-append>
                <b-button size="sm" variant="outline-dark"
                  ><b-icon icon="search" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="7">
          <b-form-group id="street" label="ENDEREÇO" label-for="street">
            <b-form-input
              id="street"
              v-model="modal.form.addresses[addressIndex].street"
              type="text"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="3">
          <b-form-group id="number" label="NÚMERO" label-for="number">
            <b-form-input
              id="number"
              v-model="modal.form.addresses[addressIndex].number"
              type="tel"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="4">
          <b-form-group
            id="neighborhood"
            label="BAIRRO"
            label-for="neighborhood"
          >
            <b-form-input
              id="neighborhood"
              v-model="modal.form.addresses[addressIndex].neighborhood"
              type="text"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="5">
          <b-form-group id="city" label="CIDADE" label-for="city">
            <b-form-input
              id="city"
              v-model="modal.form.addresses[addressIndex].city"
              type="text"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="4">
          <VueMoney
            label="TAXA"
            v-model="modal.form.addresses[addressIndex].taxa"
          />
        </b-col>
      </b-row>

      <template #modal-footer="{ cancel }">
        <b-button
          size="sm"
          variant="dark"
          @click="modal.form.addresses.push({ taxa: 0 })"
        >
          ADD ENDEREÇO
        </b-button>
        <b-button
          size="sm"
          variant="success"
          @click="
            addOrEditCustomer(modal.form);
            autoSelectCustomer();
          "
        >
          OK
        </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Multiselect from "vue-multiselect";
import { mask } from "vue-the-mask";

import VueMoney from "../components/vue-money";
export default {
  directives: { mask },
  head() {
    return {
      title: "FINALIZAR VENDA",
    };
  },
  middleware({ store, redirect }) {
    if (!store.state.cart.items.length) {
      redirect("/sale");
    }
  },
  components: {
    Multiselect,
    VueMoney,
  },
  data() {
    return {
      modal: {
        editCustomer: false,
        show: false,
        form: { _id: 0, addresses: [] },
      },
      example: {
        _id: 0,
        customer: 0,
        deliverIn: {
          taxa: 0,
        },
        discount: 0,
        flow: {
          _id: 0,
          category: "",
          date: "",
          reference: "",
          description: "",
          value: 0,
        },

        items: [],
        motoboy: undefined,
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
        timeOfDeliver: "",
      },
      form: {
        _id: 0,
        customer: 0,
        deliverIn: {
          taxa: 0,
        },
        discount: 0,
        flow: {
          _id: 0,
          category: "",
          date: "",
          reference: "",
          description: "",
          value: 0,
        },
        items: [],
        motoboy: undefined,
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
        timeOfDeliver: "",
      },
      fields: [
        { key: "selected", label: "" },
        { key: "street", label: "ENDEREÇO" },
        { key: "number", label: "NÚMERO" },
        { key: "neighborhood", label: "BAIRRO" },
        { key: "city", label: "CIDADE" },
      ],
      value: "",
      paymentMethod: {
        change: 0,
        method: "",
        value: "",
      },
      selectedCustomer: {
        _id: 0,
        address: [],
      },
    };
  },
  computed: {
    ...mapGetters("cart", ["totalAmount", "totalByProduct", "totalItems"]),
    ...mapState({
      cashier_id: (state) => state.cashier._id,
      items: (state) => state.cart.items,
      cart: (state) => state.cart,
      customers: (state) => state.customer.list,
      orderStatus: (state) => state.orderStatus,
      requests: (state) => state.requests.list,
    }),

    addresses() {
      if (this.form && this.form.addresses && this.form.addresses.length) {
        return [...this.form.addresses];
      }
      return [];
    },

    data() {
      let customer = this.customers.filter(
        (el) => el._id === this.cart.customer
      );
      return {
        _id: this.cart._id,
        cashier: this.cashier_id,
        customer: customer.length && customer[0]._id,
        deliverIn: this.form.deliverIn,
        discount: this.form.discount,
        flow: this.flow,
        items: this.items,
        orderDelivered: this.form.orderDelivered,
        orderLeftForDelivery: this.form.orderLeftForDelivery,
        orderNumber:
          this.form.orderNumber === 0
            ? this.requests.length + 1
            : this.form.orderNumber,
        orderReceived: this.form.orderReceived,
        orderStatus: this.form.orderStatus,
        orderWaiting: this.form.orderWaiting,
        paymentMethods: this.form.paymentMethods,
        timeOfDeliver: this.form.timeOfDeliver,
      };
    },

    total() {
      let total = this.form.deliverIn.taxa;
      total += this.totalAmount;
      console.log(`Computed taxa: ${this.form.deliverIn.taxa}`);
      return total - this.form.discount;
    },

    flow() {
      let totalItems = 0;
      this.items.forEach((el) => (totalItems += el.quantity));
      let description = `VENDA DE ${totalItems} PRODUTO(S)`;
      return {
        _id: this.form.flow._id,
        category: "RECEITA",
        date: this.form.flow.date,
        reference: this.form.flow.reference,
        description: description,
        value: this.total,
      };
    },

    rest() {
      let rest = this.total;
      this.cart.paymentMethods.map((m) => (rest -= m.value));
      if (rest < 0) {
        rest = 0;
      }
      console.clear();
      console.log(rest);
      return rest;
    },

    paymentMethodsTotal() {
      let total = 0;
      this.cart.paymentMethods.map((m) => (total += m.value));
      return total === this.total || this.total < total;
    },

    paymentMethodValue() {
      let total = this.paymentMethod.value;
      this.cart.paymentMethods.map((m) => (total += m.value));
      return this.showChange || this.paymentMethod.value;
    },

    showChange() {
      return (
        this.paymentMethod.method === "DINHEIRO" &&
        this.paymentMethod.value > this.rest
      );
    },
  },

  methods: {
    ...mapActions("cart", [
      "addPaymentMethod",
      "removePaymentMethod",
      "setCustomer",
      "resetCart",
    ]),
    // ...mapActions("customer", ["addOrEditCustomer"]),
    ...mapActions("flow", ["setFlow"]),
    ...mapActions("requests", ["addRequest"]),
    onRowSelected(items) {
      console.log(`selected row: ${items[0]}`);
      if (items.length) {
        this.form.deliverIn = { ...items[0] };
      } else {
        this.form.deliverIn = {
          taxa: 0,
        };
      }
    },
    // TROCO
    getChangeOfMoney() {
      if (
        this.cart.paymentMethods.length &&
        this.paymentMethod.method === "DINHEIRO" &&
        this.paymentMethod.value > this.rest
      ) {
        let value = this.paymentMethod.value;
        this.paymentMethod.change = value < this.rest ? 0 : value - this.rest;
      } else if (
        this.paymentMethod.method === "DINHEIRO" &&
        this.paymentMethod.value > this.total
      ) {
        let value = this.paymentMethod.value;
        this.paymentMethod.change = value < this.total ? 0 : value - this.total;
      } else {
        this.paymentMethod.change = 0;
      }
    },

    setChange() {
      if (this.showChange) {
        this.paymentMethod.change = this.paymentMethod.value - this.rest;
      }
    },

    setPaymentMethod() {
      this.addPaymentMethod({
        change: this.paymentMethod.change,
        method: this.paymentMethod.method,
        value: parseFloat(this.paymentMethod.value),
      });
      this.resetFormAddPaymentMethod();
    },

    resetFormAddPaymentMethod() {
      this.paymentMethod.change = 0;
      this.paymentMethod.method = "";
      this.paymentMethod.value = 0;
    },
    selectCustomer(selected) {
      this.modal.form = JSON.parse(JSON.stringify(selected));
      this.form.deliverIn = {
        taxa: 0,
      };

      this.setCustomer(selected);
    },

    cancel() {
      this.reset();
      this.resetCart();
    },

    reset() {
      this.form = { ...this.example };
      this.form.discount = 0;

      this.selectedCustomer = {};
      this.modal.form = { _id: 0, addresses: [] };
      this.setCustomer({ _id: 0 });
    },

    finish() {
      // this.addRequest(this.data);
      // this.setFlow({
      //   _id: "f98f789f687sdf7sdu0f",
      //   category: "RECEITA",
      //   reference: "f98yffd78gy98y984",
      //   description: "Venda de produtos",
      //   value: this.total,
      // });
      // this.cancel();
      // this.$router.push({ name: "requests" });
      fetch(`http://localhost:3000/requests`, {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.data),
      }).then((resp) => {
        this.cancel();
        setTimeout((_) => {
          this.$router.push({ name: "requests" });
        }, 500);
      });
    },

    autoSelectCustomer() {
      if (this.cart.customer !== 0) {
        let customer = this.customers.filter(
          (el) => el._id === this.cart.customer
        );
        this.selectedCustomer = customer[0];
        this.modal.form = JSON.parse(JSON.stringify(customer[0]));
      }
    },

    fillForEdit() {
      // console.clear();
      // console.log(this.$refs.tabla);
      if (this.cart._id !== 0) {
        const addressIndex = this.selectedCustomer.addresses.findIndex(
          (el) => JSON.stringify(el) === JSON.stringify(this.cart.deliverIn)
        );
        if (addressIndex !== -1) {
          this.form.deliverIn = this.cart.deliverIn;
          // this.$refs.tabla.selectRow(addressIndex);
        }
        this.form.flow = this.cart.flow;
        this.form.orderCancelled = this.cart.orderCancelled;
        this.form.orderDelivered = this.cart.orderDelivered;
        this.form.orderLeftForDelivery = this.cart.orderLeftForDelivery;
        this.form.orderReceived = this.cart.orderReceived;
        this.form.timeOfDeliver = this.cart.timeOfDeliver;
        this.form.discount = this.cart.discount;
      }
    },

    addOrEditCustomer(data) {
      fetch(`http://localhost:3000/customers`, {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((resp) => this.$getAllCustomers());
    },
  },

  updated() {
    if (!this.items.length) {
      this.$router.push({ name: "sale" });
    }
  },

  mounted() {
    console.clear();
    console.log(this.form);
    this.autoSelectCustomer();
    this.fillForEdit();

    this.form = { ...this.cart };

    fetch(`http://localhost:3000/customers`).then((res) =>
      console.log(res.json())
    );
  },
};
</script>

<style>
</style>