<template lang="pug">
.qkb-board-action(
  :class="actionClass"
)
  .qkb-board-action__wrapper
    .qkb-board-action__extra
      slot(name="actions")
      button.qkb-action-item( v-if="messageText", @click="empty")
        slot(name="emptyButton")
          svg(xmlns="http://www.w3.org/2000/svg",
            width="16",
            height="16",
            fill="currentColor",
            class="bi bi-x-circle-fill",
            viewBox="0 0 16 16")
              path(d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z")
    .qkb-board-action__msg-box
      input.qkb-board-action__input(
        type="text",
        v-model="messageText",
        ref="qkbMessageInput",
        :disabled="inputDisable",
        :placeholder="inputPlaceholder",
        @keydown.enter="sendMessage",
        @blur="onBlurInput ()"
      )
      .qkb-board-action__disable-text(
        v-if="inputDisablePlaceholder && inputDisable"
      )
        span {{ inputDisablePlaceholder }}
    .qkb-board-action__extra
      slot(name="actions")
      button.qkb-action-item.qkb-action-item--send(@click="sendMessage")
        slot(name="sendButton")
          IconSend.qkb-action-icon.qkb-action-icon--send
</template>
<script>
import IconSend from '../../assets/icons/send.svg'

export default {
  components: {
    IconSend
  },

  props: {
    inputPlaceholder: {
      type: String
    },

    inputDisablePlaceholder: {
      type: String
    },

    inputDisable: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      messageText: null
    }
  },

  computed: {
    actionClass () {
      const actionClasses = []

      if (this.inputDisable) {
        actionClasses.push('qkb-board-action--disabled')
      }

      if (this.messageText) {
        actionClasses.push('qkb-board-aciton--typing')
      }

      // TODO: sending

      return actionClasses
    }
  },

  mounted () {
    if (!this.GLOBAL.ifAPP) {
      this.$refs.qkbMessageInput.focus()
    }
  },

  methods: {
    sendMessage () {
      if (this.messageText) {
        this.$emit('msg-send', { text: this.messageText })
        this.messageText = null
      }
    },
    empty () {
      if (this.messageText) {
        this.messageText = null
      }
    },
    onBlurInput () {
      window.scroll(0, 0)
    }
  }
}
</script>
