<template lang="pug">
.qkb-msg-bubble(:class="bubbleClass")
  .qkb-msg-avatar(v-if="message.agent === 'bot'")
    .qkb-msg-avatar__img &nbsp;
  component(
    v-if="componentType",
    :is="componentType",
    :main-data="message"
    :fontSize="fontSize"
  )
  .qkb-msg-bubble__time(v-if="message.createdAt")
    | {{ message.createdAt }}
</template>
<script>
import SingleText from './SingleText'
import ButtonOptions from './ButtonOptions'
import NewsOptions from './NewsOptions'

export default {
  components: {
    SingleText,
    ButtonOptions,
    NewsOptions
  },

  props: {
    message: {
      type: Object
    },
    fontSize: {
      type: String,
      default: '0'
    }
  },

  computed: {
    bubbleClass () {
      return this.message.agent === 'bot'
        ? 'qkb-msg-bubble--bot'
        : 'qkb-msg-bubble--user'
    },

    // Define the message type and return the specific component
    componentType () {
      let type = ''

      switch (this.message.type) {
        case 'button':
          type = 'ButtonOptions'
          break
        case 'news':
          type = 'NewsOptions'
          break
        default:
          type = 'SingleText'
      }

      return type
    }
  }
}
</script>
