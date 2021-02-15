<template>
  <g
    class="vertex-node"
    @click="() => (childrenCount > 0 ? addPath() : undefined)"
  >
    <rect
      :id="`vertex-node-${id}`"
      class="vertex-node__rectangle"
      :x="x"
      :y="y"
      :rx="rectHeight / 2"
      :ry="rectHeight / 2"
      fill="#545454"
      :width="rectWidth"
      :height="rectHeight"
      :style="{ opacity: rectOpacity }"
    >
      <animate
        attributeName="width"
        from="0"
        :to="rectWidth"
        dur="300ms"
        ref="elRectWidth"
      />
      <animate
        attributeName="height"
        from="0"
        :to="rectHeight"
        dur="300ms"
        ref="elRectHeight"
      />
      <animate
        attributeName="rx"
        from="0"
        :to="rectHeight / 2"
        dur="300ms"
        ref="elRectRx"
      />
      <animate
        attributeName="ry"
        from="0"
        :to="rectHeight / 2"
        dur="300ms"
        ref="elRectRy"
      />
      <animate
        attributeName="y"
        :from="y + rectHeight / 2"
        :to="y"
        dur="300ms"
        ref="elRectY"
      />
    </rect>
    <circle
      v-if="childrenCount > 0"
      :fill="color"
      r="6"
      :cx="x + 6"
      :cy="y + 6"
      :style="{ opacity: rectOpacity }"
    />
    <text
      v-if="childrenCount > 0"
      class="vertex-node__text"
      font-size="7"
      dominant-baseline="middle"
      text-anchor="middle"
      :style="{ opacity: rectOpacity }"
      :x="x + 6"
      :y="y + 7"
    >
      {{ childrenCount }}
    </text>
    <title>{{ text }}</title>
    <text
      class="vertex-node__text"
      :x="rectWidth / 2 + x"
      :y="y + rectHeight / 2"
      font-size="10"
      dominant-baseline="middle"
      text-anchor="middle"
      :style="{ opacity: rectOpacity }"
    >
      <tspan
        v-for="(line, index) in lines"
        :key="index"
        :x="rectWidth / 2 + x"
        :y="
          y +
            rectHeight / 2 +
            (rectHeight / 6) * (index - (lines.length - 1) / 2)
        "
        dominant-baseline="middle"
        text-anchor="middle"
      >
        {{ line }}
      </tspan>
    </text>
    <path
      class="vertex-node__path"
      ref="nodePath"
      :d="
        `M${px},${py} C${x},${py} ${px},${y + rectHeight / 2} ${x},${y +
          rectHeight / 2}`
      "
      fill="none"
      :stroke="color"
      :stroke-dasharray="dasharray"
    />
  </g>
</template>

<script lang="ts">
  import {
    defineComponent,
    computed,
    onMounted,
    ref,
    Ref,
    SetupContext,
  } from '@vue/composition-api'

  function randomInteger(min: number, max: number) {
    const rand: number = min + Math.random() * (max - min)
    return Math.round(rand)
  }

  export default defineComponent({
    name: 'VertexNode',
    props: {
      depth: {
        required: true,
        type: Number,
      },
      position: {
        required: true,
        type: Number,
      },
      length: {
        required: true,
        type: Number,
      },
      id: {
        required: true,
        type: Number,
      },
      parentId: {
        required: false,
        type: Number,
      },
      text: {
        required: true,
        type: String,
      },
      childrenCount: {
        required: true,
        type: Number,
      },
    },
    setup(props, context: SetupContext) {
      // Смещение старта отрисовки
      const startDeltaX = 25

      const rectWidth = 200
      const rectHeight = 60
      const nodeWidth = 60
      const nodeOffset = 4

      const x = computed(
        () => startDeltaX + props.depth * (rectWidth + nodeWidth)
      )

      const path = computed(() => props.length / 2)

      const y = computed(
        () =>
          2.0 * rectHeight * (path.value - props.position) - rectHeight * 1.5
      )

      const px = ref(220 + nodeOffset)
      const py = ref(0)

      onMounted(() => {
        const element = document.getElementById(`vertex-node-${props.parentId}`)

        if (element) {
          px.value = parseFloat(element.getAttribute('x') || '0') + rectWidth
          py.value =
            parseFloat(element.getAttribute('y') || '0') + rectHeight / 2
        } else {
          px.value = 220 + nodeOffset
          py.value = 0
        }
      })

      const color = computed(() => {
        const vertex = context.root.$store.getters['vertexes/currentVertex']

        if (vertex) {
          return vertex.color
        }

        return '#fff'
      })

      const addPath = () => {
        context.root.$store.dispatch('zoom/setViewBoxCenter', {
          x: x.value + rectWidth * 0.5 + nodeWidth,
          y: 0,
        })

        context.root.$store.commit('vertexes/addPath', {
          id: props.id,
          depth: props.depth,
        })
      }

      const lines = computed(() => {
        const name: string = props.text.replace(props.text[0], props.text[0].toUpperCase())

        if (name.length < 30) {
          return [name]
        }

        const text = name.split(' ')

        const lines = []

        for (let i = 0; i <= text.length; i += 2) {
          lines.push((text[i] || '') + (text[i + 1] ? ' ' + text[i + 1] : ''))
        }

        return lines.filter(line => line.length > 0)
      })

      const nodePath: Ref<SVGPathElement | null> = ref(null)

      const totalNodeWidth = ref(nodeWidth)

      const currentNodeWidth = ref(0)

      const rectOpacity = ref(0)

      const nodeShow = ref(false)
      const electricityShow = ref(false)

      const elRectWidth: Ref<SVGAnimateElement | null> = ref(null)
      const elRectHeight: Ref<SVGAnimateElement | null> = ref(null)
      const elRectRx: Ref<SVGAnimateElement | null> = ref(null)
      const elRectRy: Ref<SVGAnimateElement | null> = ref(null)
      const elRectY: Ref<SVGAnimateElement | null> = ref(null)

      onMounted(() => {
        if (nodePath.value instanceof SVGPathElement) {
          totalNodeWidth.value = nodePath.value.getTotalLength()
        }

        let i = 0

        const animateDasharray = () => {
          currentNodeWidth.value = (totalNodeWidth.value / 100) * i

          i += 2

          if (i > 100) i = 100

          if (i < 100) {
            setTimeout(animateDasharray, 10)
          }

          if (i >= 100) {
            currentNodeWidth.value = totalNodeWidth.value

            rectOpacity.value = 1

            nodeShow.value = true

            if (elRectWidth.value instanceof SVGAnimateElement) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              elRectWidth.value.beginElement()
            }

            if (elRectHeight.value instanceof SVGAnimateElement) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              elRectHeight.value.beginElement()
            }

            if (elRectRx.value instanceof SVGAnimateElement) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              elRectRx.value.beginElement()
            }

            if (elRectRy.value instanceof SVGAnimateElement) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              elRectRy.value.beginElement()
            }

            if (elRectY.value instanceof SVGAnimateElement) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              elRectY.value.beginElement()
            }

            setTimeout(
              () => (electricityShow.value = true),
              randomInteger(1, 3) * 300
            )
          }
        }

        setTimeout(animateDasharray, 400)
      })

      const dasharray = computed(
        () =>
          `${currentNodeWidth.value} ${totalNodeWidth.value -
            currentNodeWidth.value}`
      )

      return {
        addPath,
        dasharray,
        rectOpacity,
        electricityShow,
        elRectWidth,
        nodePath,
        nodeShow,
        color,
        x,
        y,
        px,
        py,
        rectWidth,
        rectHeight,
        nodeWidth,
        lines,
      }
    },
  })
</script>

<style scoped lang="scss">
  @import '~@/styles/_settings.scss';

  .vertex-node {
    cursor: pointer;

    &__rectangle {
      transition: opacity 0.3s 0s ease;
    }

    &__text {
      font-family: Arial, sans-serif;
      fill: #ffffff;
      transition: opacity 0.3s 0s ease;
    }
  }
</style>
