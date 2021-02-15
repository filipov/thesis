<template>
  <g class="vertex" :class="{ current }" @click="$emit('click')">
    <defs>
      <filter
        id="dropshadow"
        x="-90%"
        y="-90%"
        width="280%"
        height="280%"
        filterUnits="userSpaceOnUse"
      >
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle
      class="vertex__circle"
      r="24"
      fill="transparent"
      :stroke="color"
      :cx="cx"
      :cy="cy"
    ></circle>
    <circle
      r="20"
      :fill="color"
      :cx="cx"
      :cy="cy"
    ></circle>
    <svg width="18" height="18" class="vertex-icon" :x="cx - 9" :y="cy - 9">
      <use class="vertex-icon" v-bind:[attrName]="`#icon-${icon}`" />
    </svg>
    <text class="vertex-text" ref="textElement" :x="tx" :y="ty">
      <tspan
        v-for="(line, index) in lines"
        class="vertex-text__line"
        :x="tx"
        :y="ty + 15 * index"
        :key="index"
      >
        {{ line }}
      </tspan>
    </text>
  </g>
</template>

<script lang="ts">
  import {
    defineComponent,
    computed,
    onMounted,
    SetupContext,
    ref,
    Ref,
  } from '@vue/composition-api'

  export default defineComponent({
    name: 'Vertex',
    props: {
      color: {
        default: '#ffffff',
        require: true,
        type: String,
      },
      current: {
        default: false,
        require: true,
        type: Boolean,
      },
      icon: {
        default: 'minus',
        require: true,
        type: String,
      },
      name: {
        default: 'No name',
        require: true,
        type: String,
      },
      moveAngle: {
        default: 0,
        require: true,
        type: Number,
      },
    },
    setup(props, context: SetupContext) {
      const textElement: Ref<SVGTextElement | null> = ref(null)

      const cx = computed(() => Math.cos(props.moveAngle) * 200)
      const cy = computed(() => Math.sin(props.moveAngle) * 200)

      const tcx = computed(() => Math.cos(props.moveAngle) * 200 * 1.3)
      const tcy = computed(() => Math.sin(props.moveAngle) * 200 * 1.3)

      let bBoxWidth = 0

      onMounted(() => {
        if (textElement.value instanceof SVGTextElement) {
          bBoxWidth = textElement.value.getBBox().width
        }
      })

      const tx = computed(() => {
        if (props.current) {
          return Math.cos(props.moveAngle) * 200 * 0.7 - bBoxWidth
        }

        if (
          props.moveAngle > Math.PI * 0.5 &&
          props.moveAngle < Math.PI * 1.5
        ) {
          return tcx.value - bBoxWidth
        }

        return tcx.value
      })

      const ty = computed(() => tcy.value)

      const lines = computed(() => props.name.replaceAll('-', '- ').split(' '))

      return {
        attrName: 'xlink:href',
        cx,
        cy,
        lines,
        tx,
        ty,
        textElement,
      }
    },
  })
</script>

<style scoped lang="scss">
  .vertex {
    cursor: pointer;

    &__circle {
      filter: url(#dropshadow);
      opacity: 0;
      transition: opacity 0.3s 0s ease;
    }

    &:hover,
    &.current {
      .vertex__circle {
        opacity: 1;
      }
    }
  }

  .vertex-icon {
    fill: #fff;

    height: 18px;
    width: 18px;
  }

  .vertex-text {
    font-family: Arial, sans-serif;
    fill: #242424;

    transition: x .3s .0s ease, y .3s .0s ease;

    &__line {
      fill: #242424;
      transition: x .3s .0s ease, y .3s .0s ease;
    }
  }
</style>
