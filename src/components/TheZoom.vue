<template>
  <nav class="zoom">
    <div class="zoom__inner">
      <div class="zoom__column">
        <round-button @click="setPrevZoom()">
          <svg><use xlink:href="#icon-add" /></svg>
        </round-button>
        <round-button @click="setStartZoom()">
          <svg><use xlink:href="#icon-screen" /></svg>
        </round-button>
        <round-button @click="setNextZoom()">
          <svg><use xlink:href="#icon-minus" /></svg>
        </round-button>
      </div>
      <div class="zoom__column">
        <div
          class="deep"
          :style="`grid-template-columns: repeat(${deepLevel}, auto)`"
        >
          <div v-for="index in deepLevel" class="deep__item" :class="{ active: index <= activeDeepLevel }" :key="index" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, computed, SetupContext } from '@vue/composition-api'

  import RoundButton from '@/components/RoundButton.vue'
  import { mapActions } from 'vuex'

  export default defineComponent({
    name: 'TheZoom',
    components: {
      RoundButton,
    },
    setup(_, context: SetupContext) {
      const methods = {
        ...mapActions('zoom', ['setNextZoom', 'setPrevZoom', 'setStartZoom']),
      }

      const deepLevel = computed(() => {
        const vertex = context.root.$store.getters['vertexes/currentVertex']

        if (vertex) {
          return vertex.deep
        }

        return 0
      })

      const activeDeepLevel = computed(() => {
        return context.root.$store.state.vertexes.path.length
      })

      methods.setNextZoom
      methods.setPrevZoom
      methods.setStartZoom

      return {
        activeDeepLevel,
        deepLevel,
        ...methods,
      }
    },
  })
</script>

<style scoped lang="scss">
  @import '~@/styles/_settings.scss';

  .zoom {
    background: linear-gradient(0deg, rgba(#ffffff, 1) 0%, rgba(#ffffff, 0.9) 70%, rgba(#ffffff, 0) 100%);

    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    &__inner {
      display: grid;
      margin: 50px auto;

      grid-column-gap: 32px;
      grid-template-columns: 32px auto;

      width: 80%;
    }

    &__column {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      height: 104px;
    }
  }

  .deep {
    display: grid;

    padding-top: 14px;

    grid-column-gap: 8px;

    &__item {
      background-color: $controls-color;
      border-radius: 1px;

      cursor: pointer;

      height: 2px;
      width: 100%;

      transition: background-color .3s .0s ease;

      &.active {
        background-color: #ffffff;
      }
    }
  }
</style>
