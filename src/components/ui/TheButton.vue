<template>
  <button
    type="button"
    class="button"
    :class="classList"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'TheButton',

  props: {
    type: {
      type: String,
      required: false,
      validator: (value) => {
        return [ 'primary', 'secondary' ].includes(value)
      },
      default: 'primary'
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    classList() {
      let classList = ''

      if (this.type === 'primary') {
        classList += ' button--primary'
      }

      if (this.type === 'secondary') {
        classList += ' button--secondary'
      }

      if (this.disabled) {
        classList += ' button--disabled'
      }

      return classList
    },
  }
}
</script>