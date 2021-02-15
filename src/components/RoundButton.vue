<template>
  <button class="button" @click="$emit('click')">
    <slot />
  </button>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  export default defineComponent({
    name: 'RoundButton',
  })
</script>

<style scoped lang="scss">
  @import '~@/styles/_settings.scss';

  .button {
    background-color: $controls-color;

    border: none;
    border-radius: 50%;

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    outline: none;

    transition: background-color 0.3s 0s ease;

    height: 32px;
    width: 32px;

    &::v-deep > svg {
      height: 12px;
      width: 12px;

      fill: $controls-inner-color;
    }

    &:hover {
      background-color: $white-color;
    }
  }
</style>
