<template>
  <div class="data-variables">
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
          <th>Начальное значение</th>
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
              <td>{{ (!item.type) ? item.value : getLogicTitle(item.value) }}</td>
              <td class="table__cell--controls">
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
                <input 
                  v-if="form.type === 0"
                  v-model.number="form.value" 
                  type="number" 
                />

                <select 
                  v-if="form.type === 1"
                  v-model.number="form.value"
                >
                  <option value="0">Нет</option>
                  <option value="1">Да</option>
                </select>
              </td>
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
            <input 
              v-if="form.type === 0"
              v-model.number="form.value" 
              type="number" 
            />

            <select 
              v-if="form.type === 1"
              v-model.number="form.value"
            >
              <option value="0">Нет</option>
              <option value="1">Да</option>
            </select>
          </td>
          <td class="table__cell--controls">
            <icon-button 
              :disabled="!validate"
              title="Сохранить переменную"
              icon="Check"
              @click="onApplyVariable()"
            />
            <icon-button 
              title="Отменить создание переменной"
              icon="X"
              @click="onCancelAdding()"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <the-button 
      type="primary"
      :disabled="activeRow >= 0"
      @click="onAddNewVariable"
    >
      Добавить переменную
    </the-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import translateLogicValues from '@/mixins/translateLogicValues'
import { useCalculation } from '@/libs/useCalculation'
import IconButton from '@/components/ui/IconButton.vue'
import TheButton from './ui/TheButton.vue'

export default {
  name: 'DataVariables',

  mixins: [ translateLogicValues ],

  components: {
    IconButton,
    TheButton
  },

  data() {
    return {
      form: {
        name: '',
        type: 0,
        value: 0
      },
      activeRow: -1
    }
  },

  computed: {
    ...mapState({
      variables: ({ dataVariables }) => dataVariables,
    }),

    validate() {
      if (!this.form.name.length) {
        return false
      }

      if (this.form.name.match(/[^a-zA-Z]/g)) {
        return false
      }

      return true
    }
  },

  methods: {
    ...mapActions([
      'addDataVariable',
      'addComputedVariable',
      'removeDataVariable'
    ]),

    clearForm() {
      this.activeRow = -1
      this.form.name = ''
      this.form.type = 0
      this.form.value = ''
    },

    onAddNewVariable() {
      // console.log('--- onAddNewVariable ---')
      if (this.activeRow >= 0) return

      this.activeRow = this.variables.length
    },

    onApplyVariable(index) {
      // console.log('--- onApplyVariable ---')
      const { recalculate } = useCalculation()

      this.addDataVariable({
        ...this.form, 
        index
      })

      this.clearForm()

      recalculate()
    },

    onCancelAdding() {
      console.log('--- onCancelAdding ---')
      this.clearForm()
    },

    onRemoveVariable(index) {
      this.removeDataVariable(index)
    },

    onEditVariable(item, index) {
      if (this.activeRow >= 0) return

      this.activeRow = index
      this.form.name = item.name
      this.form.type = item.type
      this.form.value = item.value
    },
  }
}
</script>