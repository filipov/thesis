import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import vertexes from '@/store/vertexes'
import zoom from '@/store/zoom'

Vue.use(Vuex)

export class RootState {
}

export default new Store<RootState>({
  state: () => new RootState(),
  mutations: {},
  actions: {},
  modules: {
    vertexes,
    zoom,
  },
})
