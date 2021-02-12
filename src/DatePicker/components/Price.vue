<template>
  <div v-if="show && price" class="price">
    <span class="price-symbol">{{ symbol }}</span>
    <span class="price-number">{{ price }}</span>
  </div>
</template>

<script>
export default {
  name: 'Price',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    symbol: {
      type: [String, null, undefined],
      default: '',
    },
  },
}
</script>

<style></style>
