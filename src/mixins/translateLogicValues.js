export default {
  methods: {
    getTypeTitle(value) {
      return !value 
        ? 'Число'
        : 'Логическое значение'
    },

    getLogicTitle(value) {
      return value
        ? 'Правда'
        : 'Ложь'
    },
  },
}