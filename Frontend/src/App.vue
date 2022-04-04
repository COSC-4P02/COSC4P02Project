<template lang="pug">
  #app(
    v-bind:style="{fontSize: fSize}"
    )
    Nav(
      :version="version"
      :switchVersion="versionSwitch"
      :fontChange ="fontChange"
    )
    Background(
      :version="version"
    )
    ChatbotUI(
      :version="version",
      :messages="messageData",
      :bot-typing="botTyping",
      :input-disable="inputDisable",
      :is-open="false",
      :fontSize="fontSize",
      @init="botStart",
      @msg-send="msgSend",
    )
</template>
<script>
import EventBus from './helpers/event-bus'
import { ChatbotUI } from './chatbot'
import Background from './components/background/Background'
import Nav from './components/Nav'
import axios from 'axios'
// import { messageService } from './helpers/message'

var ws = null

export default {
  components: {
    ChatbotUI,
    Background,
    Nav
  },

  data () {
    return {
      messageData: [],
      botTyping: false,
      inputDisable: false,
      version: this.GLOBAL.version, // Define Chatbot Version: brock / game
      fSize: '1rem',
      fontSize: '1',
      extra: ''
    }
  },

  mounted () {
    this.getNetworkType()
    this.getURLVersion()
    // SettingButtons
    EventBus.$on('SettingButtons', (msg) => {
      switch (msg) {
        case 'ClearMsg': // Clear Chat Log
          this.botTyping = true
          this.messageData = []
          setTimeout(() => {
            this.messageData.push({
              agent: 'bot',
              type: 'button',
              text: 'Chat Log Cleared',
              options: [ { text: 'Get Started', action: 'postback' } ]
            })
            this.botTyping = false
          }, 200)
          break
        case 'ExportLog': // Export Chat Log
          const chatlog = { chatlog: JSON.stringify(this.messageData) }
          axios.post(this.GLOBAL.whApi + '/chat/pdf/', chatlog)
            .then(
              response => {
                let filename = 'logs.txt'
                let element = document.createElement('a')
                element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(response.data.msg))
                element.setAttribute('download', filename)
                element.style.display = 'none'
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
                this.messageData.push({
                  agent: 'bot',
                  type: 'text',
                  text: 'Chat Log Generate complete'
                })
              })
            .catch(error => {
              this.errorMessage = error.message
              this.messageData.push({
                agent: 'bot',
                type: 'text',
                text: 'Generate Failed, try again later.'
              })
            })
          break
        case 'Help':
          this.messageData.push({
            agent: 'bot',
            type: 'button',
            text: 'Looks like you needs some help',
            options: [ { text: 'Get Started', action: 'postback' },
              { text: 'Read ChatBot Document', value: 'http://doc.krunk.cn/docs/post-2/page-9', action: 'url' },
              { text: 'Open Source Code', value: 'https://github.com/COSC-4P02/COSC4P02Project', action: 'url' } ]
          })
          break
      }
    })
  },

  methods: {

    // Connect to websocket
    connectWS () {
      ws = new WebSocket(this.GLOBAL.wsApi)
      ws.addEventListener('open', this.handleWsOpen.bind(this), false)
      ws.addEventListener('close', this.handleWsClose.bind(this), false)
      ws.addEventListener('error', this.handleWsError.bind(this), false)
      ws.addEventListener('message', this.handleWsMessage.bind(this), false)
    },

    versionSwitch (event) {
      if (this.version === 'brock' && event === 'game') {
        this.version = 'game'
      } else if (this.version === 'game' && event === 'brock') {
        this.version = 'brock'
      }
    },
    fontChange (event) {
      if (event === '0') {
        this.fontSize = '0'
        this.fSize = '0.95rem'
      } else if (event === '1') {
        this.fontSize = '1'
        this.fSize = '1rem'
      } else if (event === '2') {
        this.fontSize = '2'
        this.fSize = '1.2rem'
      }
    },

    // Connection open
    handleWsOpen (e) {
      // First message after socket open
      this.botTyping = true
      setTimeout(() => {
        this.botTyping = false
        this.messageData.push({
          agent: 'bot',
          type: 'button',
          text: 'Hello There, what can I do for you?',
          options: [ { text: 'Get Started', action: 'postback' },
            { text: 'About Brock University', action: 'postback' } ]
        })
      }, 200)
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

      if (msg.extra === 'news') {
        this.extra = msg.extra
      }

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
      if (this.extra === 'news' && value.text.toLowerCase() === 'exit news search'.toLowerCase()) {
        this.extra = ''
        this.messageData.push({ agent: 'user', type: 'text', extra: this.extra, text: value.text })
        this.messageData.push({ agent: 'bot', type: 'text', text: 'News Search Exited' })
        return
      }

      // Push the user's message to board
      this.messageData.push({
        agent: 'user',
        type: 'text',
        extra: this.extra,
        text: value.text
      })

      // Loading
      this.botTyping = true

      // Send to server
      ws.send(JSON.stringify({
        time: new Date().getTime(),
        version: this.version,
        agent: 'user',
        type: 'text',
        extra: this.extra,
        msg: value.text
      }))

      // this.getResponse()
    },

    getNetworkType () {
      if (this.GLOBAL.isMobile()) {
        // alert('you are using ' + navigator.connection.effectiveType + ' network')
      }
    },

    getURLVersion () {
      if (window.location.search === '?bot=game') {
        this.version = 'game'
      } else if (window.location.search === '?bot=brock') {
        this.version = 'brock'
      }
    },

    // Submit the message from user to bot API, then get the response from Bot
    getResponse () {
      // Loading
      // this.botTyping = true

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
