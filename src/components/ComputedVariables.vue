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
        <tr class="table__row table__row--header">
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
              <td class="table__cell--name">{{ item.name }}</td>
              <td>{{ getTypeTitle(item.type) }}</td>
              <td>{{ item.equation }}</td>
              <td>{{ (!item.type) ? item.value : getLogicTitle(item.value) }}</td>
              <td>
                <icon-button
                  title="Редактировать"
                  icon="PencilAlt"
                  @click="onEditVariable(item, i)"
                />
                <icon-button 
                  title="Удалить"
                  icon="Trash"
                  @click="onRemoveVariable(i)"
                />
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
                <icon-button 
                  :disabled="!validate"
                  title="Сохранить переменную"
                  icon="Check"
                  @click="onApplyVariable(i)"
                />
                <icon-button 
                  title="Отменить создание переменной"
                  icon="X"
                  @click="onCancelAdding"
                />
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
            <icon-button 
              :disabled="!validate"
              title="Сохранить переменную"
              icon="Check"
              @click="onApplyVariable()"
            />
            <icon-button 
              title="Отменить создание переменной"
              icon="X"
              @click="onCancelAdding"
            />
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
import IconButton from './ui/IconButton.vue'

export default {
  name: 'ComputedVariables',

  mixins: [ translateLogicValues ],

  components: {
    IconButton
  },

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
      const { calculate, recalculate } = useCalculation()

      calculate({
        exceptionVariable: this.form.name,
        equation: this.form.equation
      })

      this.form.value = calculate()

      this.addComputedVariable({
        ...this.form,
        index
      })

      this.clearForm()

      recalculate()
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