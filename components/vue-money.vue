<template>
  <b-form-group :label="label">
    <b-form-input
      v-model="displayValue"
      type="tel"
      @blur="isActive = false"
      @focus="isActive = true"
    ></b-form-input>
  </b-form-group>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
    };
  },

  props: ["label", "value"],

  computed: {
    displayValue: {
      get: function () {
        if (this.isActive) {
          return this.value.toString();
        } else {
          return this.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
        }
      },

      set: function (newValue) {
        // Recalculate value after ignoring "$" and "," in user input
        newValue = parseFloat(newValue.replace(/[^\d\.]/g, ""));
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.$emit("input", newValue);
      },
    },
  },
};
</script>

<style>
</style>