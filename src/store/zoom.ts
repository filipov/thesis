import {ActionContext, ActionTree, Module, MutationTree} from 'vuex'
import { RootState } from '@/store/index'

const viewBoxes = Object.freeze([
  [-400, -400, 800, 800],
  // Последующие размеры больше не актуальны
  // так как появилась возможность перемещаться по карте мышкой
  [0, -400, 800, 800],
  [0, -450, 900, 900],
  [0, -500, 1000, 1000],
  [0, -550, 1100, 1100],
  [0, -600, 1200, 1200],
  [0, -650, 1300, 1300],
  [0, -700, 1400, 1400],
  [0, -750, 1500, 1500],
])

export class ZoomState {
  current: number
  viewBox: number[]

  constructor() {
    this.current = 0
    this.viewBox = viewBoxes[0]
  }
}

export default {
  state: () => new ZoomState(),
  namespaced: true,
  mutations: {
    setCurrent(state: ZoomState, value: number) {
      state.current = value
    },
    setViewBox(state: ZoomState, value: number[]) {
      state.viewBox = value
    },
  } as MutationTree<ZoomState>,
  actions: {
    setNextZoom(context: ActionContext<ZoomState, RootState>) {
      context.dispatch('setCurrentZoom', context.state.current + 1)
    },
    setPrevZoom(context: ActionContext<ZoomState, RootState>) {
      context.dispatch('setCurrentZoom', context.state.current - 1)
    },
    setStartZoom(context: ActionContext<ZoomState, RootState>) {
      context.dispatch('setCurrentZoom', 0)
    },
    moveViewBox(
      context: ActionContext<ZoomState, RootState>,
      value: Record<'x' | 'y', number>
    ) {
      const currentZoom = context.state.viewBox

      const nextZoom = [
        currentZoom[0] + value.x,
        currentZoom[1] + value.y,
        currentZoom[2],
        currentZoom[3],
      ]

      context.commit('setViewBox', nextZoom)
    },
    setViewBoxCenter(
      context: ActionContext<ZoomState, RootState>,
      value: Record<'x' | 'y', number>
    ) {
      const duration = 300
      const delay = 10
      const steps = duration / delay

      let currentZoom = context.state.viewBox

      const nextZoom = [
        value.x - currentZoom[2] / 2,
        value.y - currentZoom[3] / 2,
        currentZoom[2],
        currentZoom[3],
      ]

      const sliceZoom = [
        (nextZoom[0] - currentZoom[0]) / steps,
        (nextZoom[1] - currentZoom[1]) / steps,
        (nextZoom[2] - currentZoom[2]) / steps,
        (nextZoom[3] - currentZoom[3]) / steps,
      ]

      let i = 0

      const interval = setInterval(() => {
        if (i < steps) {
          currentZoom = [
            currentZoom[0] + sliceZoom[0],
            currentZoom[1] + sliceZoom[1],
            currentZoom[2] + sliceZoom[2],
            currentZoom[3] + sliceZoom[3],
          ]

          context.commit('setViewBox', currentZoom)
        } else {
          context.commit('setViewBox', nextZoom)

          clearInterval(interval)
        }

        i++
      }, delay)
    },
    setCurrentZoom(
      context: ActionContext<ZoomState, RootState>,
      value: number
    ) {
      const duration = 300
      const delay = 10
      const steps = duration / delay

      let currentZoom = context.state.viewBox

      let zoom = value
      if (value < 0) zoom = 0
      if (value >= viewBoxes.length) zoom = viewBoxes.length - 1

      // const nextZoom = viewBoxes[zoom]

      const cx = context.state.viewBox[2] / 2 + context.state.viewBox[0]
      const cy = context.state.viewBox[3] / 2 + context.state.viewBox[1]

      const nextZoom =
        value === 0 || value === 1
          ? viewBoxes[value]
          : [
            cx - 350 - zoom * 50,
            cy - 350 - zoom * 50,
            (350 + zoom * 50) * 2,
            (350 + zoom * 50) * 2,
          ]

      const sliceZoom = [
        (nextZoom[0] - currentZoom[0]) / steps,
        (nextZoom[1] - currentZoom[1]) / steps,
        (nextZoom[2] - currentZoom[2]) / steps,
        (nextZoom[3] - currentZoom[3]) / steps,
      ]

      let i = 0

      context.commit('setCurrent', zoom)

      const interval = setInterval(() => {
        if (i < steps) {
          currentZoom = [
            currentZoom[0] + sliceZoom[0],
            currentZoom[1] + sliceZoom[1],
            currentZoom[2] + sliceZoom[2],
            currentZoom[3] + sliceZoom[3],
          ]

          context.commit('setViewBox', currentZoom)
        } else {
          context.commit('setViewBox', nextZoom)

          clearInterval(interval)
        }

        i++
      }, delay)
    },
  } as ActionTree<ZoomState, RootState>,
  modules: {},
} as Module<ZoomState, RootState>
