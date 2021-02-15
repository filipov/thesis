import data from '@/collections/tree.json'
import {
  ActionTree,
  ActionContext,
  Module,
  MutationTree,
  GetterTree,
} from 'vuex'
import animateCircleMotion from '@/scripts/animateCircleMotion'
import { RootState } from '@/store/index'
import treeToNestedSetsArray from '@/scripts/treeToNestedSetsArray'
import { VertexNode, VertexNodeNS } from '@/scripts/VertexNode'

const nodeDeep = (nodes?: VertexNode[]): number => {
  if (nodes === undefined || nodes.length === 0) return 0

  const counts: number[] = nodes.map((node: VertexNode): number =>
    nodeDeep(node.nodes)
  )

  return Math.max(...counts) + 1
}

export class Vertex {
  angle: number
  name: string
  color: string
  deep: number
  icon: string

  nodes: VertexNodeNS[]

  constructor(name: string, color: string, icon: string, nodes?: VertexNode[]) {
    this.angle = 0
    this.name = name
    this.color = color
    this.deep = nodeDeep(nodes)
    this.icon = icon
    this.nodes = []

    if (nodes) {
      this.nodes = treeToNestedSetsArray(nodes)
    }
  }
}

export class VertexesState {
  current: number
  list: Vertex[]
  path: number[] = [0]

  constructor() {
    this.current = -1
    this.list = data.nodes.map(
      node => new Vertex(node.name, node.color, node.icon, node.nodes)
    )
  }
}

export default {
  state: () => new VertexesState(),
  namespaced: true,
  getters: {
    currentVertex(state): Vertex {
      return state.list[state.current]
    },
    currentNodes(state, getters): VertexNodeNS[] {
      return getters.currentVertex.nodes.filter(
        (node: VertexNodeNS): boolean => {
          return state.path.includes(node.parentId || 0)
        }
      )
    },
  } as GetterTree<VertexesState, RootState>,
  mutations: {
    setCurrent(state: VertexesState, value: number) {
      state.path = [0]

      if (state.list[value] !== undefined) {
        state.current = value
      }

      if (value === -1) {
        state.current = value
      }
    },
    setAngle(state: VertexesState, value: Record<'index' | 'angle', number>) {
      if (state.list[value.index] !== undefined) {
        state.list[value.index].angle = value.angle
      }
    },
    addPath(state: VertexesState, value: Record<'id' | 'depth', number>) {
      state.path = state.path.slice(0, value.depth)

      state.path.push(value.id)
    },
  } as MutationTree<VertexesState>,
  actions: {
    setCurrent(state: ActionContext<VertexesState, RootState>, value: number) {
      state.commit('setCurrent', value)
    },
    setAngle(
      context: ActionContext<VertexesState, RootState>,
      value: Record<'index' | 'angle', number>
    ) {
      if (context.state.list[value.index] !== undefined) {
        animateCircleMotion(
          context.state.list[value.index].angle,
          value.angle,
          200,
          800,
          angle =>
            context.commit('setAngle', {
              index: value.index,
              angle,
            })
        )
      }
    },
  } as ActionTree<VertexesState, RootState>,
  modules: {},
} as Module<VertexesState, RootState>
