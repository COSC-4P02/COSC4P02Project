<template>
  <div class="a">
    <div class="qkb-board-header">
      <div class="qkb-board-header__title">{{ botTitle }}</div>
      <div>
        <p @click.prevent="$refs.menu.open($event)" class="settings">
          <SettingsIcon class="icon" />
        </p>
      </div>

    </div>
    <vue-context ref="menu" lazy>
      <li>
        <a href="#" @click.prevent="onClick(1)">Download Chat Log</a>
      </li>
      <li>
        <a href="#" @click.prevent="onClick(2)">Clear Chat</a>
      </li>
      <li>
        <a href="#" @click.prevent="onClick(3)">Help</a>
      </li>
      <!-- <li>
        <a href="#" @click.prevent="onClick($event.target.innerText)">Button</a>
      </li> -->
    </vue-context>
  </div>
</template>
<script>
import EventBus from '../../helpers/event-bus'
import VueContext from '../../helpers/menu/index'
import SettingsIcon from '../../assets/icons/settings.svg'

export default {
  components: {
    VueContext,
    SettingsIcon
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
    }
  }
}
</script>
