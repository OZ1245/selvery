<template>
  <div id="app">
    <main class="main">
      <!-- <div class="main__content"> -->
        <the-tabs
          v-model="activeTabId"
          :list="tabsList"
          class="tabs"
        >
          <template v-slot:default="{ id }">
            <component :is="id"></component>
          </template>
        </the-tabs>
      <!-- </div> -->
    </main>

    <footer class="footer">
      <button 
        type="button"
        @click="onSaveData()"
      >
        Сохранить
      </button>

      <button 
        type="button"
        @click="onRemoveData()"
      >
        Отчистить
      </button>
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import TheTabs from '@/components/ui/TheTabs.vue'
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
    ...mapActions([
      'initCachedData',
      'saveData',
      'removeData'
    ]),

    onSaveData() {
      this.saveData()
    },

    onRemoveData() {
      this.removeData()
    }
  }
}
</script>
