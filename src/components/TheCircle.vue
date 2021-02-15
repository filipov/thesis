<template>
  <svg class="map" height="100%" width="100%" :viewBox="viewBox" ref="map">
    <circle class="circle" r="200" cx="0" cy="0" />
    <ellipse class="circle circle__shadow" cx="0" cy="0" rx="185" ry="215" />
    <ellipse class="circle circle__shadow" cx="0" cy="0" rx="215" ry="185" />
    <vertex
      v-for="(vertex, index) in vertexes"
      :color="vertex.color"
      :current="index === current && zoom > 0"
      :icon="vertex.icon"
      :name="vertex.name"
      :move-angle="vertex.angle"
      :key="index"
      @click="setCurrent(index)"
    />
    <template v-if="zoom > 0">
      <template v-for="depth in deepLevel" class="deep__item">
        <vertex-node
          v-for="(node, index) in vertexNodes.filter(
            node => node.depth === depth - 1
          )"
          :depth="depth"
          :position="index"
          :length="vertexNodes.filter(node => node.depth === depth - 1).length"
          :id="node.id"
          :parent-id="node.parentId"
          :text="node.name"
          :children-count="node.childrenCount"
          :key="`vertex-${node.id}`"
        />
      </template>
    </template>
  </svg>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    onMounted,
    SetupContext,
    ref,
    Ref,
  } from '@vue/composition-api'
  import Vertex from '@/components/Vertex.vue'
  import VertexNode from '@/components/VertexNode.vue'
  import { Vertex as VertexClass } from '@/store/vertexes'

  export default defineComponent({
    name: 'TheCircle',
    components: {
      Vertex,
      VertexNode,
    },
    setup(_, context: SetupContext) {
      const map: Ref<SVGElement | null> = ref(null)

      const viewBox = computed(() =>
        context.root.$store.state.zoom.viewBox.join(' ')
      )

      const current = computed(() => context.root.$store.state.vertexes.current)

      const zoom = computed(() => context.root.$store.state.zoom.current)

      const vertexes = computed(() => context.root.$store.state.vertexes.list)

      const vertexNodes = computed(() => {
        const vertex = context.root.$store.getters['vertexes/currentVertex']

        if (vertex) {
          return context.root.$store.getters['vertexes/currentNodes']
        }

        return []
      })

      const deepLevel = computed(() => {
        const vertex = context.root.$store.getters['vertexes/currentVertex']

        if (vertex) {
          return vertex.deep
        }

        return 0
      })

      onMounted(() => {
        const anglePart = (Math.PI * 2) / vertexes.value.length

        vertexes.value.forEach((_: unknown, index: number) => {
          context.root.$store.dispatch('vertexes/setAngle', {
            index,
            angle: anglePart * (index + 2) - Math.PI / 2,
          })
        })
      })

      const setCurrent = (index: number) => {
        context.root.$store.dispatch('vertexes/setCurrent', -1)

        setTimeout(() => {
          context.root.$store.dispatch('zoom/setCurrentZoom', 1)

          setTimeout(
            () => context.root.$store.dispatch('vertexes/setCurrent', index),
            1200
          )

          const deltaAngle = Math.PI * 2 - vertexes.value[index].angle

          if (deltaAngle === 0 || deltaAngle === Math.PI * 2) return

          vertexes.value.forEach((vertex: VertexClass, index: number) => {
            context.root.$store.dispatch('vertexes/setAngle', {
              index,
              angle: vertex.angle + deltaAngle,
            })
          })
        }, 10)
      }

      onMounted(() => {
        let moveDirectionY: boolean | undefined = undefined

        let touchPrevCoordinates = { x: 0, y: 0 }

        const getMovementCoordinatesForTouch = (
          e: TouchEvent
        ): Record<'x' | 'y', number> => {
          const touch = e.touches.item(0)

          if (touch) {
            const movementCoordinates = {
              x: touch.clientX - touchPrevCoordinates.x,
              y: touch.clientY - touchPrevCoordinates.y,
            }

            touchPrevCoordinates = {
              x: touch.clientX,
              y: touch.clientY,
            }

            return movementCoordinates
          }

          return { x: 0, y: 0 }
        }

        if (map.value instanceof SVGElement) {
          const moveMap = (e: MouseEvent | TouchEvent) => {
            console.log('second')

            const movement: Record<'x' | 'y', number> =
              e instanceof MouseEvent
                ? { x: e.movementX, y: e.movementY }
                : getMovementCoordinatesForTouch(e)

            if (moveDirectionY === undefined) {
              moveDirectionY = Math.abs(movement.y) > Math.abs(movement.x)
            }

            const coordinates = moveDirectionY
              ? {
                  x: 0,
                  y: movement.y * -1,
                }
              : {
                  x: movement.x * -1,
                  y: 0,
                }

            context.root.$store.dispatch('zoom/moveViewBox', coordinates)
          }

          map.value.addEventListener('mousedown', () => {
            if (zoom.value > 0) {
              document.onmousemove = moveMap
            }
          })

          map.value.addEventListener('touchstart', e => {
            if (zoom.value > 0) {
              const touch = e.touches.item(0)

              if (touch) {
                touchPrevCoordinates = {
                  x: touch.clientX,
                  y: touch.clientY,
                }
              }

              if (map.value instanceof SVGElement) {
                map.value.addEventListener('touchmove', moveMap, true)
              }
            }
          })

          map.value.addEventListener('mouseup', () => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            document.onmousemove = () => {}
            moveDirectionY = undefined
          })

          map.value.addEventListener('touchend', () => {
            if (map.value instanceof SVGElement) {
              map.value.removeEventListener('touchmove', moveMap)
            }
            moveDirectionY = undefined
          })
        }
      })

      onMounted(() => {
        document.addEventListener(
          'touchmove',
          e => {
            console.log('first')
            e.stopPropagation()
          },
          false
        )
      })

      return {
        current,
        setCurrent,
        viewBox,
        vertexes,
        zoom,

        vertexNodes,
        deepLevel,

        map,
      }
    },
  })
</script>

<style scoped lang="scss">
  .map {
    background-color: #ffffff;

    display: block;

    cursor: move;
  }

  .circle {
    fill: transparent;
    stroke: #242424;
    stroke-width: 1px;

    &__shadow {
      opacity: 0.3;

      animation: rotate 10s 0s linear alternate infinite;
    }
  }

  @keyframes rotate {
    0% {
      opacity: 0.1;
      transform: rotateZ(0deg);
      stroke: #ffffff;
    }
    25% {
      opacity: 0.2;
      transform: rotateZ(90deg);
      stroke: #ffff00;
    }
    50% {
      opacity: 0.3;
      transform: rotateZ(180deg);
      stroke: #ff00ff;
    }
    75% {
      opacity: 0.2;
      transform: rotateZ(-90deg);
      stroke: #00ffff;
    }
    100% {
      opacity: 0.1;
      transform: rotateZ(0deg);
      stroke: #ffffff;
    }
  }
</style>
