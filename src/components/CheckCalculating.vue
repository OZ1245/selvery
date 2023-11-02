<template>
  <div class="check-calculating">
    <div class="check-calculating__column">
      <h3 class="check-calculating__header">Вводимые значения</h3>

      <template v-if="data.length">
        <div 
          v-for="(item, i) in dataVariables"
          :key="`data-var-${dataKey}-${i}`"
          class="check-calculating__control"
        >
          <label :for="item.name">{{ item.name }}</label>
          
          <input 
            v-if="item.type === 0"
            type="text" 
            v-model="data[i].value"
            @keyup="onChangeDataVariable"
          >

          <select 
            v-if="item.type === 1"
            v-model.number="data[i].value"
            @change="onChangeDataVariable"
          >
            <option value="0">Нет</option>
            <option value="1">Да</option>
          </select>
        </div>
      </template>
    </div>
    <div class="check-calculating__column">
      <h3 class="check-calculating__header">Результат вычисляемых значений</h3>

      <table 
        v-if="computed.length"
        class="check-calculating__table"
      >
        <tr
          v-for="(item, i) in computedVariables"
          :key="`computed-var-${compKey}-${i}`"
        >
          <td>{{ item.name }}</td>
          <td>{{ (!item.type) ? computed[i].value : getLogicTitle(computed[i].value) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { useCalculation } from '@/libs/useCalculation'
import translateLogicValues from '@/mixins/translateLogicValues'

export default {
  name: 'CheckCalculating',

  mixins: [ translateLogicValues ],

  data() {
    return {
      data: [],
      computed: [],
      dataKey: 0,
      compKey: 0
    }
  },

  computed: {
    ...mapState({
      dataVariables: ({ dataVariables }) => dataVariables,
      computedVariables: ({ computedVariables }) => computedVariables
    })
  },

  mounted() {
    this.dataVariables  
      .map((item) => {
        this.data = [
          ...this.data,
          {
            name: item.name,
            value: item.value
          }
        ]
      })

    this.computedVariables
      .map((item) => {
        this.computed = [
          ...this.computed,
          {
            name: item.name,
            value: item.value
          }
        ]
      })
  },

  methods: {
    onChangeDataVariable() {
      console.log('--- onChangeDataVariable ---')
      this.dataKey++

      this.computedVariables
        .map((item, i) => {
          console.log('item:', item)

          const { calculate } = useCalculation({
            exceptionVariable: item.name,
            equation: item.equation,
            variables: [
              ...this.data,
              ...this.computed
            ]
          })

          const value = calculate()
          console.log('value:', value)

          this.computed[i] = {
            name: item.name,
            value: value
          }
          this.compKey++

          console.log('this.computed:', this.computed)
        })
    }
  }
}
</script>