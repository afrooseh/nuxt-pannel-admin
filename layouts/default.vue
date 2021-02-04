<template>
  <div>
    <b-navbar fixed="top" variant="dark" toggleable="sm" type="dark">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            class="text-uppercase"
            v-for="link in links"
            :key="'btn-' + link.title"
            :to="link.to"
            >{{ link.title }}</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-b-popover.hover="{ container: '#cartList' }">
            <b-icon-cart-fill></b-icon-cart-fill>
            <b-badge variant="danger">{{ totalItems }}</b-badge>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <Nuxt />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    links: [
      { title: "Caixa", to: "/" },
      // { title: "", to: "" },
      { title: "Categorias", to: "categories" },
      { title: "Clientes", to: "customers" },
      { title: "Configurações", to: "settings" },
      { title: "Ingredientes", to: "ingredients" },
      { title: "Pedidos", to: "requests" },
      { title: "Produtos", to: "products" },
      { title: "Venda", to: "sale" },
      { title: "DASN", to: "dasn" },
    ],
  }),

  computed: {
    ...mapGetters("cart", ["totalItems"]),
  },

  mounted() {
    this.$getAllCategories();
    this.$getAllCustomers();
    this.$getAllIngredients();
    this.$getAllProducts();
    this.$getAllRequests();

    this.$getFlow();
  },
};
</script>

<style>
@import url("../assets/style.css");
body,
html {
  background: #ffffff !important;
}
</style>