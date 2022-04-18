const ifApp = false
const version = 'brock'
const wsApi = 'wss://ws.chatbot-ai.ga:8001'
const whApi = 'https://api.chatbot-ai.ga'
const height = '100%'
// Production Server
// wsApi: 'wss://ws.chatbot-ai.ga:8001',
// whApi: 'https://api.chatbot-ai.ga',

// Development Server
// wsApi: 'wss://localhost:8001',
// whApi: 'http://localhost:3000',

function isMobile () {
  return ('ontouchstart' in document.documentElement)
}

export default
{
  ifApp,
  version,
  whApi,
  wsApi,
  height,
  isMobile
}
