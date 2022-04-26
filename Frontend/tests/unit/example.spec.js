import { shallowMount } from '@vue/test-utils'
import Background from '@/components/background/Background'
import Nav from '@/components/Nav'
import BotUI from '@/components/BotUI';
import App from '@/App.vue'
import Vue from 'vue'
import _global_ from '@/global'
Vue.prototype.GLOBAL = _global_

describe('Background.vue', () => {
  const wrapper = shallowMount(Background, {
    data () {
      return {
        msg: {
          items: [{
            title: 'title',
            description: 'd',
            image: '../assets/brock/Brock.jpg',
            link: ''
          }]
        }
      }
    },
    propsData: { version: '1' }
  })

  it('Background be exists', () => {
    const wrapper = shallowMount(Nav)
    expect(wrapper.exists()).toBe(true)
  })

  it('find data/props in Background is create', () => {
    expect(wrapper.find('h5').text()).toEqual('title')
    expect(wrapper.find('p').text()).toEqual('d')
    expect(wrapper.props().version).toContain('1')
  })
})

describe('Nav.vue', () => {
  const wrapper = shallowMount(Nav, {
    data () {
      return {
        botInfo: {
          botTitle: 'bot title',
          botIcon: '../assets/icons/bubble.svg',
          IconAlt: '',
          navTitle: 'nav title',
          OfficialWeb: ''
        }
      }
    },
    propsData: { version: '1' }
  })

  it('Nav be exists', () => {
    const wrapper = shallowMount(Nav)
    expect(wrapper.exists()).toBe(true)
  })

  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find data/props in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
    expect(wrapper.find('a').text()).toEqual('bot title')
    expect(wrapper.props().version).toContain('1')
  })
  it('find methods in Nav is done', () => {
    const mockFn = jest.fn()
    wrapper.setMethods({
      switchVersion: mockFn
    })
    wrapper.find('.dropdown-item').trigger('click')
    expect(mockFn).toBeCalled()
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})

describe('BotUI.vue', () => {
  const wrapper = shallowMount(BotUI, {
    data () {
      return {
        botActive: true,
        defaultOptions: {
          botTitle: 'Chatbot', // Bot Title Color
          colorScheme: '#cc0000', // Bot Color
          textColor: '#fff',
          bubbleBtnSize: 65,
          animation: true,
          boardContentBg: '#fff',
          botAvatarSize: 32,
          botAvatarImg: 'http://placehold.it/200x200',
          msgBubbleBgBot: '#f0f0f0',
          msgBubbleColorBot: '#000',
          msgBubbleBgUser: '#cc0000', // User Bubble Color
          msgBubbleColorUser: '#fff',
          inputPlaceholder: 'Message',
          inputDisableBg: '#fff',
          inputDisablePlaceholder: null
        }
      }
    },
    propsData: {
      version: '1',
      messages: 'Hello bot',
      botTyping: false,
      inputDisable: false,
      isOpen: true,
      openDelay: '1',
      fontSize: '0'
    }
  })

  it('BotUI be exists', () => {
    const wrapper = shallowMount(Nav)
    expect(wrapper.exists()).toBe(true)
  })
  
})
