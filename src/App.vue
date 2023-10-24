<template>
  <div id="app">
    <the-tabs
      v-model="activeTabId"
      :list="tabsList"
    >
      <template v-slot:default="{ id }">
        <component :is="id"></component>
      </template>
    </the-tabs>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import TheTabs from '@/components/TheTabs.vue'
import DataVariables from '@/components/DataVariables.vue'
import ComputedVariables from '@/components/ComputedVariables.vue'
import CheckCalculating from '@/components/CheckCalculating.vue'

export default {
  name: 'App',

  components: {
    TheTabs,
    DataVariables,
    ComputedVariables,
    CheckCalculating,
  },

  data() {
    return {
      activeTabId: 0,
      tabsList: [
        {
          id: 'DataVariables',
          title: 'Вводимые значения'
        },
        {
          id: 'ComputedVariables',
          title: 'Вычисляемые значения'
        },
        {
          id: 'CheckCalculating',
          title: 'Проверка расчетов'
        },
      ]
    }
  },

  created() {
    this.initCachedData()
  },

  mounted() {
    this.activeTabId = this.tabsList[0].id
  },

  methods: {
    ...mapActions(['initCachedData'])
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
