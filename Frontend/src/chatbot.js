import ChatbotUI from './components/BotUI.vue'

const Plugin = {
  install (Vue, options) {
    Vue.component('ChatbotUI', ChatbotUI)

    if (options) {
      // console.log('options', options)
    }
  }
}

export default Plugin
export { ChatbotUI }
