<template>
  <div class="body">
    <the-circle />
    <the-zoom />

    <library />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import Library from './components/Library.vue'
  import TheCircle from './components/TheCircle.vue'
  import TheZoom from './components/TheZoom.vue'

  export default defineComponent({
    name: 'App',
    components: {
      Library,
      TheCircle,
      TheZoom,
    },
  })
</script>

<style lang="scss">
  html,
  body,
  .body {
    margin: 0;
    padding: 0;

    height: 100%;
    width: 100%;

    background-color: #ffffff;
    overflow: hidden;
  }

  //.body {
  //  display: flex;
  //
  //  flex-direction: column;
  //}

  * {
    user-select: none;
  }
</style>
