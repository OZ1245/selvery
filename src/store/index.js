import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataVariables: [],
    computedVariables: []
  },
  getters: {
  },
  mutations: {
    SET_DATA(state, data) {
      state.dataVariables = [
        ...state.dataVariables,
        data
      ]
    },

    SET_COMPUTED(state, data) {
      state.computedVariables = [
        ...state.computedVariables,
        data
      ]
    },

    REMOVE_DATA(state, index) {
      state.dataVariables.splice(index, 1)
    },

    REMOVE_COMPUTED(state, index) {
      state.computedVariables.splice(index, 1)
    },

    UPDATE_DATA(state, { index, name, type, value }) {
      state.dataVariables[index] = {
        name,
        type,
        value
      } 
    }
  },
  actions: {
    initCachedData({ commit }) {
      const ls = localStorage.getItem('selveryCache')

      if (ls) {
        const data = JSON.parse(ls)

        data.dataVariables.map((item) => {
          commit('SET_DATA', item)
        })

        data.computedVariables.map((item) => {
          commit('SET_COMPUTED', item)
        })
      }
    },

    addDataVariable({ state, commit }, { name, type, value, index }) {
      if (typeof index !== 'undefined') {
        commit('UPDATE_DATA', {
          name,
          type,
          value,
          index
        })
      } else {
        commit('SET_DATA', {
          name,
          type,
          value
        })
      }

      // localStorage.removeItem('selveryCache')

      // localStorage.setItem(
      //   'selveryCache',
      //   JSON.stringify(state)
      // )
      updateCacheLocalStorage(state)
    },

    addComputedVariable({ state, commit }, payload) {
      commit('SET_COMPUTED', payload)

      // localStorage.removeItem('selveryCache')

      // localStorage.setItem(
      //   'selveryCache',
      //   JSON.stringify(state)
      // )
      updateCacheLocalStorage(state)
    },

    removeDataVariable({ state, commit }, index) {
      commit('REMOVE_DATA', index)

      updateCacheLocalStorage(state)
    },

    removeComputedVariable({ state, commit }, index) {
      commit('REMOVE_COMPUTED', index)

      updateCacheLocalStorage(state)
    },

    saveData({ state }) {
      localStorage.removeItem('selvery')

      localStorage.setItem(
        'selvery',
        JSON.stringify(state)
      )
    },

    removeData() {
      localStorage.removeItem('selvery')
    },
  },
  modules: {
  }
})

const updateCacheLocalStorage = (state) => {
  localStorage.removeItem('selveryCache')

  localStorage.setItem(
    'selveryCache',
    JSON.stringify(state)
  )
}
