<template>
  <b-container>
    <b-row>
      <b-col>
        <h4>CATEGORIAS</h4>
        <b-table
          bordered
          responsive
          striped
          :fields="fields"
          :items="categories"
        >
          <template #cell(products)="data">{{ data.value.length }}</template>

          <template #cell(actions)="data">
            <b-icon-pencil
              style="cursor: pointer !important"
              :id="'tooltip-pencil-target-' + data.index"
              @click="editCategory(data.item)"
            ></b-icon-pencil>
            <b-tooltip
              :target="'tooltip-pencil-target-' + data.index"
              triggers="hover"
              >EDITAR CATEGORIA</b-tooltip
            >
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <pre>{{ JSON.stringify(this.modal.form) }}</pre>
        <b-button variant="success" @click="addCategory">NOVA</b-button>
        <b-modal
          v-model="modal.show"
          size="lg"
          centered
          no-close-on-esc
          no-close-on-backdrop
          @close="reset"
          :title="modal.edit ? 'EDITAR CATEGORIA' : 'NOVA CATEGORIA'"
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
              <label class="typo__label">ACEITA INGREDIENTES</label>
              <b-form-select
                :options="[
                  { text: 'NÃO', value: false },
                  { text: 'SIM', value: true },
                ]"
                v-model="modal.form.acceptsIngredients"
                placeholder=""
              >
              </b-form-select>
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      example: {
        _id: 0,
        acceptsIngredients: false,
        name: "",
        products: [],
      },
      fields: [
        {
          label: "NOME",
          align: "start",
          sortable: false,
          key: "name",
        },
        {
          label: "PRODUTOS",
          align: "start",
          sortable: false,
          key: "products",
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
    }),
  },

  methods: {
    addCategory() {
      this.reset();
      this.modal.edit = false;
      this.modal.show = true;
    },
    editCategory(item) {
      this.modal.form = { ...item };
      this.modal.edit = true;
      this.modal.show = true;
    },
    reset() {
      this.modal.form = { ...this.example };
      this.modal.edit = false;
      this.modal.show = false;
    },
    sendForm() {
      // this.modal.form.acceptsIngredients = this.modal.form.acceptsIngredients.value;
      fetch(`http://localhost:3000/categories`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.modal.form),
      }).then((resp) => {
        this.$getAllCategories();
      });
    },
  },

  mounted() {
    this.modal.form = { ...this.example };
  },
};
</script>

<style>
</style>