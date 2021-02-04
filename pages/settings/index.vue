<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <h4>CONFIGURAÇÕES</h4>
      </b-col>
      <b-col cols="12" sm="6" md="4">
        <b-form-group id="fg-cnpj" label="CNPJ" label-for="cnpj">
          <the-mask
            class="form-control"
            mask="##.###.###/####-##"
            v-model="form.cnpj"
            :masked="true"
            :type="'tel'"
          ></the-mask>
        </b-form-group>
      </b-col>
      <b-col>
        <b-button variant="success" @click="sendForm">SALVAR</b-button>
        <pre>{{ JSON.stringify(settings, null, 2) }}</pre>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      settings: (state) => state.settings,
    }),
  },

  data() {
    return {
      form: {},
    };
  },

  methods: {
    ...mapActions("settings", ["setSettings"]),

    sendForm() {
      this.setSettings({ data: this.form });
    },
  },

  mounted() {
    this.form = { ...this.settings };
  },
};
</script>

<style>
</style>