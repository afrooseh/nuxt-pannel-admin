<template>
  <b-container>
    <b-row>
      <b-col>
        <h4>PRODUTOS</h4>

        <b-table
          bordered
          hover
          outlined
          responsive
          striped
          :fields="fields"
          :items="products"
        >
          <template #cell(price)="data">
            {{ $money(data.value) }}
          </template>
          <template #cell(actions)="data">
            <b-icon-pencil
              style="cursor: pointer !important"
              :id="'tooltip-pencil-target-' + data.index"
              @click="editProduct(data.item)"
            ></b-icon-pencil>
            <b-tooltip
              :target="'tooltip-pencil-target-' + data.index"
              triggers="hover"
              >EDITAR PRODUTO</b-tooltip
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
          :title="modal.edit ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'"
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
            <b-col cols="12" sm="6" md="4">
              <b-form-group id="fg-name" label="NOME" label-for="name">
                <b-form-input
                  id="name"
                  v-model="modal.form.name"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="12" sm="6" md="4">
              <!-- <v-select
              :items="categories"
              v-model="category"
              label="CATEGORIA"
              item-text="name"
              return-object
              @change="selectCategory"
              clearable
            ></v-select> -->
              <label class="typo__label">CATEGORIA</label>
              <multiselect
                :options="categories"
                v-model="modal.form.category"
                placeholder=""
                :allow-empty="false"
                :showLabels="false"
                label="name"
                track-by="_id"
              >
              </multiselect>
            </b-col>
          </b-row>

          <b-row
            v-if="
              modal.form.category !== undefined &&
              modal.form.category.acceptsIngredients
            "
          >
            <b-col cols="12">
              <h5>INGREDIENTES</h5>
            </b-col>
            <b-col
              cols="4"
              sm="2"
              v-for="(ingredient, ingredientIndex) in modal.form.ingredients"
              :key="ingredientIndex"
            >
              <b-form-group
                id="fg-quantity"
                :label="ingredient.name"
                label-for="quantity"
              >
                <b-form-input
                  type="number"
                  min="0"
                  v-model.number="ingredient.quantity"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" sm="6" md="3">
              <VueMoney
                label="PREÇO SUGERIDO"
                disabled
                v-model="suggestedPrice"
              />
            </b-col>
            <b-col cols="12" sm="6" md="3">
              <VueMoney label="PREÇO" v-model="modal.form.price" />
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
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Multiselect from "vue-multiselect";
import VueMoney from "../../components/vue-money";
export default {
  head() {
    return {
      title: "PRODUTOS",
    };
  },

  components: { Multiselect, VueMoney },
  data() {
    return {
      example: {
        _id: 0,
        category: {
          acceptsIngredients: false,
          name: "",
        },
        ingredients: [],
        price: 0,
        promotion: "NÃO",
        promotionCondition: {
          type: "",
        },
      },
      fields: [
        {
          label: "NOME",
          align: "start",
          sortable: false,
          key: "name",
        },
        {
          label: "CATEGORIA",
          align: "start",
          sortable: false,
          key: "category.name",
        },
        {
          label: "PREÇO",
          align: "start",
          sortable: false,
          key: "price",
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
        form: {},
        show: false,
      },
    };
  },

  computed: {
    ...mapState({
      categories: (state) => state.categories.list,
      ingredients: (state) => state.ingredients.list,
      products: (state) => state.products.list,
    }),
    product() {
      return {
        _id: this.modal.form._id,
        category: this.modal.form.category,
        ingredients: this.modal.form.ingredients,
        price: this.modal.form.price,
        promotion: this.modal.form.promotion,
        promotionCondition: {
          type: this.modal.form.promotionCondition.type,
        },
      };
    },
    suggestedPrice() {
      let price = 0;
      console.log(this.modal.form);
      if (this.modal.form.ingredients !== undefined) {
        const ingredients = this.modal.form.ingredients.filter(
          (el) => el.quantity > 0
        );
        ingredients.map(
          (el) => (price += parseInt(el.quantity) * el.sale.value)
        );
      }
      return price;
    },
  },

  methods: {
    ...mapActions("products", ["setProduct"]),

    editProduct(item) {
      this.modal.form = { ...item };
      this.modal.edit = true;
      this.modal.show = true;
    },

    reset() {
      this.modal.edit = false;
      this.modal.show = false;
      this.modal.form = { ...this.example };
      this.modal.form.ingredients = JSON.parse(
        JSON.stringify([...this.ingredients])
      );
    },

    sendForm() {
      // this.setProduct(this.modal.form);
      // this.reset();

      // this.modal.form.acceptsIngredients = this.modal.form.acceptsIngredients.value;
      fetch(`http://localhost:3000/products`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.modal.form),
      }).then((resp) => {
        this.$getAllProducts();
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