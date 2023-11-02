<template>
  <button
    type="button"
    :title="title"
    class="icon-button"
    @click="$emit('click')"
  >
    <component :is="iconName"></component>
  </button>
</template>

<script>
import * as icons from '@vue-hero-icons/solid'
import '@/assets/scss/components/icon_button.scss'

export default {
  name: 'IconButton',

  components: {
    icons
  },

  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    iconName() {
      return icons[`${this.icon}Icon`]
    }
  }
}
</script>