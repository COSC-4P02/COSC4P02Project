<template>
  <div class="qkb-msg-bubble-component qkb-msg-bubble-component--button-options" :class="sizeClass">
    <div class="card" style="width: 18rem;">
      <img src="" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">{{ mainData.text }}</h5>
      </div>
      <ul class="list-group list-group-flush">
        <a class="list-group-item" v-for="(item, index) in mainData.news"
           :class="{ active: selectedItem === item.title }"
           :key="index"
           :href="item.href"
           target="_blank"
           >
          <div>{{item.title}}</div></a>
      </ul>
    </div>
    <div class="qkb-msg-bubble-component__options-wrapper">
      <div class="qkb-mb-button-options__item" v-for="(item, index) in mainData.options"
           :class="{ active: selectedItem === item.value }"
           :key="index">
        <button class="qkb-mb-button-options__btn" v-if="item.action === 'postback'"
                @click="selectOption(item)">
          <span>{{ item.text }}</span>
        </button>
        <a target="_blank"
           v-else
           :href="item.value"
           class="qkb-mb-button-options__btn qkb-mb-button-options__url">
          <span>{{ item.text }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '../../helpers/event-bus'

export default {
  props: {
    mainData: {
      type: Object
    },
    fontSize: {
      type: String,
      default: '1'
    }
  },
  computed: {
    sizeClass () {
      if (this.fontSize === '0') {
        return 'qkb-msg-bubble-component--sizeS'
      } else if (this.fontSize === '2') {
        return 'qkb-msg-bubble-component--sizeL'
      } else {
        return ''
      }
    }
  },

  data () {
    return {
      selectedItem: null
    }
  },

  methods: {
    selectOption (value) {
      this.selectedItem = value
      EventBus.$emit('select-button-option', value)
    }
  }
}
</script>
