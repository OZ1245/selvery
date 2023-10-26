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
              <td>{{ item.name }}</td>
              <td>{{ getTypeTitle(item.type) }}</td>
              <td>{{ (!item.type) ? item.type : getLogicTitle(item.value) }}</td>
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
                <template v-if="form.type === 0">
                  <input v-model.number="form.value" type="number" />
                </template>

                <template v-if="form.type === 1">
                  <select v-model.number="form.value">
                    <option value="0">Нет</option>
                    <option value="1">Да</option>
                  </select>
                </template>
              </td>
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
            <template v-if="form.type === 0">
              <input v-model.number="form.value" type="number" />
            </template>

            <template v-if="form.type === 1">
              <select v-model.number="form.value">
                <option value="0">Нет</option>
                <option value="1">Да</option>
              </select>
            </template>
          </td>
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
import translateLogicValues from '@/mixins/translateLogicValues';

export default {
  name: 'DataVariables',

  mixins: [ translateLogicValues ],

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
      variables: ({ dataVariables }) => dataVariables
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
      'removeDataVariable'
    ]),

    // getTypeTitle(value) {
    //   return !value 
    //     ? 'Число'
    //     : 'Логическое значение'
    // },

    // getLogicTitle(value) {
    //   return value
    //     ? 'Правда'
    //     : 'Ложь'
    // },

    clearForm() {
      this.activeRow = -1
      this.form.name = ''
      this.form.type = 0
      this.form.value = ''
    },

    onAddNewVariable() {
      console.log('--- onAddNewVariable ---')
      if (this.activeRow >= 0) return

      this.activeRow = this.variables.length
    },

    onApplyVariable(index) {
      console.log('--- onApplyVariable ---')

      this.addDataVariable({
        ...this.form, 
        index
      })
      this.clearForm()
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