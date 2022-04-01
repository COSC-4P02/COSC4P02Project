<template>
  <div class="qkb-board-header">
    <div class="qkb-board-header__title">{{ botTitle }}</div>
    <div class="btn-group" role="toolbar">
      <a class="btn" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <SettingsIcon class="icon"/>
      </a>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <li v-if="!this.GLOBAL.ifAPP" ><a class="dropdown-item" href="#" @click.prevent="onClick(1)">Download Chat Log</a></li>
        <li><a class="dropdown-item" href="#" @click.prevent="onClick(2)">Clear Chat</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" @click.prevent="onClick(3)">Help</a></li>
      </ul>
      <a v-if="!this.GLOBAL.ifAPP" class="btn" role="button" @click="botClose()"><CloseIcon class="icon"/></a>
    </div>
  </div>
</template>
<script>
import EventBus from '../../helpers/event-bus'
import SettingsIcon from '../../assets/icons/settings.svg'
import CloseIcon from '../../assets/icons/close.svg'

export default {
  components: {
    SettingsIcon,
    CloseIcon
  },
  props: {
    botTitle: {
      type: String,
      default: 'Chatbot'
    }
  },
  methods: {
    onClick (text) {
      switch (text) {
        case 1:
          EventBus.$emit('SettingButtons', 'ExportLog')
          break
        case 2:
          EventBus.$emit('SettingButtons', 'ClearMsg')
          break
        case 3:
          EventBus.$emit('SettingButtons', 'Help')
          break
        default:
          alert(`Button Pressed: ${text}`)
      }
    },
    botClose () {
      this.$emit('close-bot', '1')
    }
  }
}
</script>
