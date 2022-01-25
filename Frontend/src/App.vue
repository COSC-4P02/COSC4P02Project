<template lang="pug">
#app
  ChatbotUI(
    :options="botOptions",
    :messages="messageData",
    :bot-typing="botTyping",
    :input-disable="inputDisable",
    :is-open="false",
    @init="botStart",
    @msg-send="msgSend",
  )
</template>
<script>
import BotIcon from './assets/icons/bot.png'
import { ChatbotUI } from './chatbot'
// import { messageService } from './helpers/message'

var ws = null

export default {
  components: {
    BotIcon,
    ChatbotUI
  },

  data () {
    return {
      messageData: [],
      botTyping: false,
      inputDisable: false,
      botOptions: {
        botAvatarImg: BotIcon,
        boardContentBg: '#f4f4f4',
        msgBubbleBgBot: '#fff',
        inputPlaceholder: 'Type here...',
        inputDisableBg: '#fff',
        inputDisablePlaceholder: 'Hit the buttons above to respond'
      }
    }
  },

  methods: {

    // Connect to websocket
    connectWS () {
      ws = new WebSocket('wss://ws.chatbot-ai.ga:8001')
      ws.addEventListener('open', this.handleWsOpen.bind(this), false)
      ws.addEventListener('close', this.handleWsClose.bind(this), false)
      ws.addEventListener('error', this.handleWsError.bind(this), false)
      ws.addEventListener('message', this.handleWsMessage.bind(this), false)
    },

    // Connection open
    handleWsOpen (e) {
      // First message after socket open
      this.botTyping = true
      setTimeout(() => {
        this.botTyping = false
        this.messageData.push({
          agent: 'bot',
          type: 'text',
          text: 'Hello There, what can I do for you?'
        })
      }, 500)
    },

    // Connection closed
    handleWsClose (e) {
      this.botTyping = true
      setTimeout(() => {
        this.botTyping = false
        this.messageData.push({
          agent: 'bot',
          type: 'text',
          text: 'Something went wrong, close the pop-up and open it again'
        })
      }, 1000)
    },
    handleWsError (e) {

    },

    // Receive message from ws server
    handleWsMessage (e) {
      const msg = JSON.parse(e.data)

      const replyMessage = {
        agent: 'bot',
        ...msg
      }
      this.inputDisable = msg.disableInput
      this.messageData.push(replyMessage)
      this.botTyping = false
    },

    // Run when pop-up open
    botStart () {
      // Connect WebSocket
      if (ws === null || ws.readyState === WebSocket.CLOSED) {
        this.connectWS()
      }
    },

    // Get user input and send to server
    msgSend (value) {
      // Push the user's message to board
      this.messageData.push({
        agent: 'user',
        type: 'text',
        text: value.text
      })

      // Send to server
      ws.send(JSON.stringify({
        data: new Date().getTime(),
        agent: 'user',
        type: 'message',
        msg: value.text
      }))

      this.getResponse()
    },

    // Submit the message from user to bot API, then get the response from Bot
    getResponse () {
      // Loading
      this.botTyping = true

      // Post the message from user here
      // Then get the response as below

      // Create new message from fake data
      // messageService.createMessage()
      //   .then((response) => {
      //     const replyMessage = {
      //       agent: 'bot',
      //       ...response
      //     }

      //     this.inputDisable = response.disableInput
      //     this.messageData.push(replyMessage)

      //     // finish
      //     this.botTyping = false
      //   })
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
