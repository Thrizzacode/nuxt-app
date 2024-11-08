<script setup lang="ts">
const { count, increment, decrement } = useCounter();
</script>

<template>
  <h1>Page: 首頁</h1>
  <!-- <div>目前路由的路徑 - route.fullPath 為: {{ $route.fullPath }}</div> -->
  <!-- <div class="counter">
    <button type="button" @click="decrement">-</button>
    <p>{{ count }}</p>
    <button type="button" @click="increment">+</button>
  </div> -->
  <Connection />
</template>

<style scoped>
.counter {
  display: flex;
  gap: 10px;
  /* justify-content: center;
  align-items: center; */
}
</style>
