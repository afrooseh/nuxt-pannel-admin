<template>
  <b-container>
    <b-row>
      <b-col cols="12" :sm="cartItems.length ? 8 : 12">
        <b-table
          bordered
          hover
          outlined
          responsive
          striped
          :fields="fields"
          :items="products"
        >
          <template v-slot:cell(price)="data">
            {{ $money(data.item.price) }}
          </template>
          <template v-slot:cell(actions)="data">
            <b-btn
              block
              dark
              size="sm"
              class="rounded-0"
              color="blue darken-1"
              @click="
                selectedProduct = { ...data.item };
                dialogShowProduct = true;
              "
              >ADICIONAR
            </b-btn>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12" sm="4" v-if="cartItems.length">
        <table class="printer-ticket">
          <thead>
            <tr>
              <th class="title" colspan="3"><b>W&B LANCHES</b></th>
            </tr>
            <tr>
              <td colspan="3"><b>CLIENTE</b>: {{ selectedCustomer.name }}</td>
            </tr>
            <tr>
              <td colspan="3"><b>ENDEREÇO</b>: {{ cart.deliverIn.street }}</td>
            </tr>
            <tr>
              <td colspan="3"><b>DATA: </b> {{ dateNow }}<br /></td>
            </tr>
            <tr>
              <td colspan="3"><b>PEDIDO</b>: 00001</td>
            </tr>
            <tr>
              <th class="ttu" colspan="3">
                <b>Cupom não fiscal</b>
              </th>
            </tr>
            <tr>
              <th style="text-align: left !important">DESC/VL UN</th>
              <th style="text-align: left !important">QTD</th>
              <th style="text-align: right !important">VL TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, itemIndex) in cartItems">
              <tr class="top" :key="'aa' + itemIndex">
                <td colspan="3">
                  {{ item.name }}
                  <span v-if="item.additionals.length">[</span>
                  <span
                    v-for="(additional, additionalIndex) in item.additionals"
                    :key="additionalIndex"
                    >+{{ additional.quantity }} {{ additional.name
                    }}<span
                      v-if="
                        item.additionals.length > 1 &&
                        additionalIndex < item.additionals.length
                      "
                      >,
                    </span></span
                  >
                  <span v-if="item.additionals.length">]</span>
                </td>
              </tr>
              <tr :key="'ab' + itemIndex">
                <td>
                  {{
                    $money(totalByProduct(itemIndex).oneProductAndAdditionals)
                  }}
                </td>
                <td>x{{ item.quantity }}</td>
                <td>
                  {{
                    $money(totalByProduct(itemIndex).allProductsAndAdditionals)
                  }}
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr class="sup ttu p--0">
              <td colspan="3">
                <b>Totais</b>
              </td>
            </tr>
            <tr class="ttu">
              <td colspan="2">Sub-total</td>
              <td align="right">{{ $money(subTotal) }}</td>
            </tr>
            <tr class="ttu">
              <td colspan="2">Taxa de serviço</td>
              <td align="right">{{ cart.deliverIn.taxa }}</td>
            </tr>
            <tr class="ttu">
              <td colspan="2">Desconto</td>
              <td align="right">{{ cart.discount }}</td>
            </tr>
            <tr class="ttu">
              <td colspan="2">Total</td>
              <td align="right">{{ $money(totalAmount) }}</td>
            </tr>
            <tr class="sup ttu p--0">
              <td colspan="3">
                <b>Pagamentos</b>
              </td>
            </tr>
            <template v-for="(payment, paymentIndex) in cart.paymentMethods">
              <tr class="ttu" :key="paymentIndex">
                <td colspan="2">{{ payment.method }}</td>
                <td align="right">{{ $money(payment.value) }}</td>
              </tr>
              <tr
                class="ttu"
                v-if="payment.method === 'DINHEIRO'"
                :key="'troco' + paymentIndex"
              >
                <td colspan="2">Troco</td>
                <td align="right">{{ $money(payment.change) }}</td>
              </tr>
            </template>
          </tfoot>
        </table>
        <b-list-group>
          <b-list-group-item
            v-for="(item, itemIndex) in cartItems"
            :key="itemIndex"
            class="flex-column align-items-start"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ item.quantity }} x {{ item.name }}</h5>
              <small>
                <b-button
                  variant="danger"
                  squared
                  size="sm"
                  @click="removeItem(itemIndex)"
                  ><b-icon icon="trash"></b-icon
                ></b-button>
              </small>
            </div>

            <p class="mb-1">
              <b-badge
                class="mr-2"
                variant="success"
                v-for="(additional, additionalIndex) in item.additionals"
                :key="additionalIndex"
                >{{ additional.quantity }} x {{ additional.name }}</b-badge
              >
            </p>

            <small>{{ $money(totalByProduct(itemIndex)) }}</small>
          </b-list-group-item>
        </b-list-group>
        <b-button
          block
          class="mt-3"
          :disabled="totalAmount == 0"
          squared
          variant="success"
          to="finish"
          >FINALIZAR ({{ $money(totalAmount) }})</b-button
        >
      </b-col>
      <!-- <b-col
      cols="6"
      sm="3"
      v-for="(product, productIndex) in products"
      :key="productIndex"
      class="mt-0 pt-0"
    >
      <b-card
        no-body
        outlined
        tile
        :img-src="product.imgUrl"
        class="border-0 rounded-0"
      >
        <b-card-text class="p-2">
          <b-card-title class="subtitle-1">{{ product.name }}</b-card-title>

          <b-card-subtitle>{{ $money(product.price) }}</b-card-subtitle>
        </b-card-text>

        <b-btn
          block
          class="rounded-0"
          color="blue darken-1"
          @click="
            selectedProduct = { ...product };
            dialogShowProduct = true;
          "
          >Adicionar
        </b-btn>
      </b-card>
    </b-col> -->
      <b-modal
        v-if="selectedProduct != undefined"
        v-model="dialogShowProduct"
        size="huge"
        scrollable
        @click:outside="closeModal"
        :title="selectedProduct.name"
        class="rounded-0"
        @close="closeModal"
      >
        <b-container fluid v-if="selectedProduct.category.acceptsIngredients">
          <b-row
            fluid
            v-for="(additional, additionalIndex) in additionals"
            :key="additionalIndex"
            align-v="baseline"
          >
            <b-col cols="8">
              <p class="mb-1">{{ additional.name }}</p>
              <p class="mb-1 additional-price">
                {{ $money(additional.sale.value) }}
              </p>
            </b-col>
            <b-col cols="4">
              <label for="">QUANT.</label>
              <b-form-input
                v-model.number="additional.quantity"
                type="number"
                min="0"
                max="100"
                :step="additional.sale.quantity"
              />
            </b-col>
          </b-row>
        </b-container>
        <template v-slot:modal-footer>
          <b-row>
            <b-col>
              <b-form-input
                label="QUANTIDADE"
                v-model.number="quantity"
                type="number"
                min="1"
                max="100"
              />
            </b-col>
            <b-col class="text-right">
              <b-button variant="success" class="rounded-0" @click="add">
                ADICIONAR&nbsp;&nbsp;&nbsp;{{ $money(total) }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      dateNow: this.$moment().format("DD/MM/YYYY HH:mm:ss"),
      dialogShowProduct: false,
      fields: [
        { key: "name", label: "PRODUTO" },
        { key: "price", label: "PREÇO" },
        { key: "actions", label: "" },
      ],
      selectedProduct: undefined,
      number: 0,
      additionals: [],
      quantity: 1,
      selectedCustomer: {},
    };
  },

  head() {
    return {
      title: "VENDA",
    };
  },

  computed: {
    ...mapState({
      cart: (state) => state.cart,
      customers: (state) => state.customer.list,
      products: (state) => state.products.list,
      ingredients: (state) => state.ingredients.list,
    }),
    ...mapGetters("cart", [
      "totalAmount",
      "totalByProduct",
      "subTotal",
      "totalItems",
    ]),
    cartItems() {
      return this.$store.state.cart.items;
    },

    total() {
      let total = 0;

      if (this.selectedProduct !== undefined) {
        total += this.quantity * this.selectedProduct.price;
        this.additionals
          .filter((add) => add.quantity >= 1)
          .forEach((add) => {
            let totalAdditionals =
              ((add.quantity * add.sale.value) / add.quantity) *
              (add.quantity / add.sale.quantity);
            total += totalAdditionals * this.quantity;
          });
      }
      return total;
    },

    requestInfo() {
      return [
        { label: "CLIENTE", text: this.selectedCustomer.name },
        { label: "DATA", text: this.dateNow },
        { label: "PEDIDO", text: "00001" },
      ];
    },
  },

  methods: {
    ...mapActions("cart", ["addItem", "removeItem"]),

    add() {
      this.selectedProduct.additionals = this.additionals.filter(
        (add) => add.quantity >= 1
      );
      this.selectedProduct.quantity = this.quantity;
      this.addItem(this.selectedProduct);
      this.closeModal();
    },

    closeModal() {
      this.additionals = JSON.parse(JSON.stringify(this.ingredients));
      this.selectedProduct = undefined;
      this.dialogShowProduct = false;
      this.quantity = 1;
    },

    updateDateNow() {
      this.dateNow = this.$moment().format("DD/MM/YYYY HH:mm:ss");
    },

    autoSelectCustomer() {
      if (this.cart.customer !== 0) {
        let customer = this.customers.filter(
          (el) => el._id === this.cart.customer
        );
        this.selectedCustomer = customer[0];
      }
    },
  },

  created() {
    setInterval(this.updateDateNow, 1000);
  },

  mounted() {
    this.autoSelectCustomer();

    this.additionals = JSON.parse(JSON.stringify(this.ingredients));
  },
};
</script>

<style scoped>
.sticky {
  position: sticky !important;
  position: -webkit-sticky !important;
}

.additional-price {
  color: red;
}
.modal .modal-huge {
  max-width: 250px !important;
  width: 250px !important;
}
</style>
