<template>
  <div class="tabs">
    <ul class="tabs__panel">
      <li
        v-for="(item, i) in list"
        :key="`tab-${i}`" 
        class="tabs__item"
        :class="{ 'tab-panel__tab--active': item.id === value }"
        @click="onChangeTab(item)"
      >
        {{ item.title }}
      </li>
    </ul>

    <div class="tabs__content">
      <slot name="default" :id="value"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheTabs',

  props: {
    value: {
      type: [ Number, String ],
      required: true
    },
    list: {
      type: Array,
      required: true,
    }
  },

  methods: {
    onChangeTab(item) {
      this.$emit('input', item.id)
    }
  }
}
</script>