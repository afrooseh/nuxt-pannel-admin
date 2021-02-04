<template>
  <b-container>
    <b-row>
      <b-col>
        <h4>PEDIDOS</h4>
        <b-table
          bordered
          sort-by="orderNumber"
          :sort-desc="true"
          :fields="fields"
          :items="requests"
          responsive
        >
          <template #cell(customer)="data">
            {{ data.value.name }}
          </template>
          <template #cell(deliverIn)="data">
            {{ data.value.street }}, Nº {{ data.value.number }} -
            {{ data.value.neighborhood }}
          </template>
          <template #cell(actions)="data">
            <b-icon-pencil
              v-if="data.item.orderStatus !== 99 && data.item.orderStatus !== 4"
              style="cursor: pointer !important"
              :id="'tooltip-pencil-target-' + data.index"
              @click="editRequest(data.item)"
            ></b-icon-pencil>
            <b-tooltip
              :target="'tooltip-pencil-target-' + data.index"
              triggers="hover"
              >EDITAR PEDIDO</b-tooltip
            >
            <b-icon-file-text
              style="cursor: pointer !important"
              :id="'popover-target-' + data.index"
            ></b-icon-file-text>
            <b-popover
              :target="'popover-target-' + data.index"
              triggers="hover"
              placement="right"
              bottomleft
              title="ITEMS"
              class="custom-popover"
            >
              <b-list-group class="border-0">
                <b-list-group-item
                  v-for="(item, itemIndex) in data.item.items"
                  :key="itemIndex"
                  class="border-top-0 border-right-0 border-left-0 border-bottom"
                >
                  <div class="d-flex w-100 justify-content-between">
                    {{ item.quantity }} x {{ item.name }}
                  </div>

                  <p class="mb-1">
                    <b-badge
                      class="mr-2"
                      variant="success"
                      v-for="(additional, additionalIndex) in item.additionals"
                      :key="additionalIndex"
                      >{{ additional.quantity }} x
                      {{ additional.name }}</b-badge
                    >
                  </p>
                </b-list-group-item>
              </b-list-group>
            </b-popover>
            <b-icon-alarm
              style="cursor: pointer !important"
              :id="'tooltip-alarm-target-' + data.index"
              v-if="data.item.timeOfDeliver"
            ></b-icon-alarm>
            <b-tooltip
              :target="'tooltip-alarm-target-' + data.index"
              triggers="hover"
              >{{ data.item.timeOfDeliver }}</b-tooltip
            >
          </template>
          <template #cell(status)="data">
            <div class="text-center">
              <b-badge
                style="cursor: pointer !important"
                v-on="
                  data.item.orderStatus !== 99 && data.item.orderStatus !== 4
                    ? { click: () => changeStatus(data.item) }
                    : {}
                "
                :id="'tooltip-change-status-target-' + data.index"
                :variant="requestStatus(data.item.orderStatus).class"
                >{{ requestStatus(data.item.orderStatus).text }}</b-badge
              >
            </div>
            <b-tooltip
              v-if="data.item.orderStatus !== 99 && data.item.orderStatus !== 4"
              :target="'tooltip-change-status-target-' + data.index"
              triggers="hover"
              >MUDAR STATUS</b-tooltip
            >
          </template>
        </b-table>
      </b-col>
      <b-col cols="12">
        <pre>{{ JSON.stringify(modal.form, null, 2) }}</pre>
      </b-col>
    </b-row>

    <b-modal
      v-model="modal.show"
      size="sm"
      centered
      no-close-on-esc
      no-close-on-backdrop
      @close="reset"
      title="ALTERAR STATUS"
    >
      <b-row fluid>
        <b-col cols="12">
          <b-form-group
            id="orderStatus"
            label="NOVO STATUS"
            label-for="orderStatus"
          >
            <b-form-select
              id="orderStatus"
              v-model="modal.form.orderStatus"
              :options="orderStatus"
              placeholder=""
            >
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <template v-slot:modal-footer>
        <b-button variant="success" class="rounded-0" @click="sendForm"
          >SALVAR</b-button
        >
        <b-button variant="danger" class="rounded-0" @click="reset"
          >CANCELAR</b-button
        >
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  head() {
    return {
      title: "PEDIDOS",
    };
  },

  data() {
    return {
      fields: [
        { key: "orderNumber", label: "#" },
        { key: "customer", label: "CLIENTE" },
        { key: "deliverIn", label: "ENDEREÇO" },
        // { key: "deliverIn.neighborhood", label: "BAIRRO" },
        // { key: "deliverIn.city", label: "CIDADE" },
        // { key: "deliverIn.street", label: "ENDEREÇO" },
        // { key: "timeOfDeliver", label: "ENTREGAR ÀS" },
        // { key: "items", label: "" },
        { key: "status", label: "STATUS" },
        { key: "actions", label: "" },
      ],
      example: {
        _id: 0,
        orderStatus: null,
      },
      modal: {
        form: {},
        show: false,
      },
    };
  },

  computed: {
    ...mapGetters("requests", ["requestStatus"]),
    ...mapState({
      requests: (state) => state.requests.list,
      orderStatus: (state) => state.orderStatus,
    }),
  },

  methods: {
    ...mapActions("cart", ["resetCart", "setCartForEdit"]),

    changeStatus(request) {
      const { _id, orderStatus } = request;
      this.modal.form = {
        _id,
        orderStatus,
      };
      this.modal.show = true;
    },

    editRequest(data) {
      console.clear();
      console.log(data);
      this.resetCart();
      this.setCartForEdit({ ...data });
      this.$router.push({ name: "sale" });
    },

    reset() {
      this.modal.form = { ...this.example };
      this.modal.show = false;
    },

    sendForm() {},
  },

  mounted() {
    console.clear();
    console.log(this.requests);
    this.$getAllRequests();
    this.modal.form = { ...this.example };
  },
};
</script>

<style>
.popover-body {
  padding: 0 !important;
}
</style>