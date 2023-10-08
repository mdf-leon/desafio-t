<template>
  <button
  class="p-3 bg-teal-600 text-white border rounded-md block cursor-pointer"
  :class="computedClasses"
  >
  <slot></slot>
</button>
</template>

<script lang="ts">
// @ts-nocheck
export default {
  props: {
    color: {
      type: String as PropType<"teal">,
      default: "teal"
    }
  },

  computed: {
    computedClasses() {
      const classes: string[] = [];

      switch(this.color) {
        case "teal":
          classes.push("border-teal-700", "bg-teal-600", "hover:bg-teal-800");
        break;

        case "red":
          classes.push("border-red-700", "bg-red-600", "hover:bg-red-800");
        break;
      }

      return classes;
    }
  }
}
</script>