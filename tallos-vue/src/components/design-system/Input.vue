<template>
  <input
    class="p-3 bg-white border rounded-md"

    :value="computedValue"

    @input="onInput"
  />
</template>

<script lang="ts">
// @ts-nocheck
import { watch, toRefs } from "vue";

export default {
  props: {
    modelValue: String
  },

  data() {
    return {
      computedValue: this.modelValue
    }
  },

  watch: {
    modelValue(v) {
      this.computedValue = v;
    }
  },

  methods: {
    onInput(event: InputEvent) {
      this.computedValue = event.target.value;

      this.$emit("input", this.computedValue);
      this.$emit("update:modelValue", this.computedValue);
    }
  }
}
</script>