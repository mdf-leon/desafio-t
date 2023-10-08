<template>
  <i class="fa fa-fw" :class="name"></i>
</template>

<script lang="ts">
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>