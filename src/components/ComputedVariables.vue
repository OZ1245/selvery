<template>
  <div class="computed-variables">
    <table class="table">
      <p
        v-if="!variables.length && activeRow < 0"
        class="warning"
      >
        Переменные еще не добавлены
      </p>

      <thead>
        <tr>
          <th>Переменная</th>
          <th>Тип</th>
          <th>Формула</th>
          <th>Значение</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <template v-if="variables.length">
          <template v-for="(item, i) in variables">
            <tr
              v-show="i !== activeRow"
              :key="`variable-${i}`"
              class="table__row"
              :class="{ 'table__row--hidden': i === activeRow }"
            >
              <td>{{ item.name }}</td>
              <td>{{ getTypeTitle(item.type) }}</td>
              <td>{{ item.equation }}</td>
              <td>{{ (!item.type) ? item.value : getLogicTitle(item.value) }}</td>
              <td>
                <button
                  type="button"
                  class="button button--icon"
                  title="Редактировать"
                  @click="onEditVariable(item, i)"
                >
                  ...
                </button>
                <button 
                  class="button button--icon" 
                  type="button"
                  title="Удалить"
                  @click="onRemoveVariable(i)"
                >X</button>
              </td>
            </tr>
            
            <!-- Edit form -->
            <tr
              v-if="activeRow === i"
              :key="`variable-edit-${i}`"
              class="table__row table__row--form"
            >
              <td>
                <input v-model="form.name" type="text" />
              </td>
              <td>
                <select v-model.number="form.type">
                  <option value="0">Число</option>
                  <option value="1">Логическое значение</option>
                </select>
              </td>
              <td>
                <textarea v-model="form.equation" rows="2"></textarea>
              </td>
              <td></td>
              <td>
                <button 
                  type="button" 
                  class="button button--icon"
                  :disabled="!validate"
                  title="Сохранить переменную"
                  @click="onApplyVariable(i)"
                >V</button>
                <button 
                  class="button button--icon" 
                  type="button"
                  title="Отменить создание переменной"
                  @click="onCancelAdding"
                >X</button>
              </td>
            </tr>
          </template>
        </template>

        <tr
          v-if="activeRow === variables.length"
          class="table__row table__row--form"
        >
          <td>
            <input v-model="form.name" type="text" />
          </td>

          <td>
            <select v-model.number="form.type">
              <option value="0">Число</option>
              <option value="1">Логическое значение</option>
            </select>
          </td>

          <td>
            <textarea v-model="form.equation" rows="2"></textarea>
          </td>

          <td></td>

          <td>
            <button 
              type="button"
              class="button button--icon"
              :disabled="!validate"
              title="Сохранить переменную"
              @click="onApplyVariable()"
            >V</button>
            <button 
              class="button button--icon" 
              type="button"
              title="Отменить создание переменной"
              @click="onCancelAdding"
            >X</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button 
      class="button button--primary" 
      type="button"
      :disabled="activeRow >= 0"
      @click="onAddNewVariable"
    >
      Добавить переменную
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { useCalculation } from '@/libs/useCalculation'
import translateLogicValues from '@/mixins/translateLogicValues'

const { 
  setOptions,
  calculate 
} = useCalculation()

export default {
  name: 'ComputedVariables',

  mixins: [ translateLogicValues ],

  data() {
    return {
      form: {
        name: '',
        type: 0,
        equation: '',
        value: 0
      },
      activeRow: -1
    }
  },

  computed: {
    ...mapState({
      variables: ({ computedVariables }) => computedVariables
    }),

    validate() {
      if (!this.form.name.length) {
        return false
      }

      if (this.form.name.match(/[^a-zA-Z]/g)) {
        return false
      }

      if (!this.form.equation.length) {
        return false
      }

      return true
    }
  },

  methods: {
    ...mapActions([
      'addComputedVariable',
      'removeComputedVariable'
    ]),

    clearForm() {
      this.activeRow = -1
      this.form.name = ''
      this.form.type = 0
      this.form.equation = ''
      this.form.value = 0
    },

    onAddNewVariable() {
      if (this.activeRow >= 0) return

      this.activeRow = this.variables.length
    },

    onApplyVariable(index) {
      setOptions({
        exceptionVariable: this.form.name,
        equation: this.form.equation
      })

      this.form.value = calculate()

      this.addComputedVariable({
        ...this.form,
        index
      })

      this.clearForm()
    },

    onCancelAdding() {
      this.clearForm()
    },

    onRemoveVariable(index) {
      this.removeComputedVariable(index)
    },

    onEditVariable(item, index) {
      if (this.activeRow >= 0) return 

      this.activeRow = index
      this.form.name = item.name
      this.form.type = item.type
      this.form.equation = item.equation
      this.form.value = item.value
    },
  }
}
</script>