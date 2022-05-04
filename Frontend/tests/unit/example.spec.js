import { shallowMount } from '@vue/test-utils'
import Background from '@/components/background/Background'
import Nav from '@/components/Nav'
import BotUI from '@/components/BotUI'
import Header from '@/components/Board/Header'
import Content from '@/components/Board/Content'
import Action from '@/components/Board/Action'
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
            description: 'description',
            image: '../assets/brock/Brock.jpg',
            link: 'https://google.com'
          }]
        }
      }
    },
    propsData: { version: '1' }
  })

  it('Background be exists', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('find data "title" in Background is create', () => {
    expect(wrapper.find('h5').text()).toEqual('title')
  })
  it('find data "description" in Background is create', () => {
    expect(wrapper.find('p').text()).toEqual('description')
  })
  it('find props "version" in Background is create', () => {
    expect(wrapper.props().version).toContain('1')
  })
  it('find data in Background that checks href to "link"', () => {
    expect(wrapper.find('a').attributes().href).toBe('https://google.com')
  })
  it('find data in Background that checks src in img to be "image"', () => {
    expect(wrapper.find('img').attributes().src).toBe('../assets/brock/Brock.jpg')
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
          OfficialWeb: 'https://google.com'
        }
      }
    },
    propsData: { version: '1' }
  })

  it('Nav be exists', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('find data "navTitle" in Nav is create', () => {
    expect(wrapper.find('h5').text()).toEqual('nav title')
  })
  it('find data "botTitle" in Nav is create', () => {
    expect(wrapper.find('a').text()).toEqual('bot title')
  })
  it('find props "version" in Nav is create', () => {
    expect(wrapper.props().version).toContain('1')
  })
  it('find data in Nav that checks src in img to be "botIcon"', () => {
    expect(wrapper.find('img').attributes().src).toBe('../assets/icons/bubble.svg')
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
      inputDisable: true,
      isOpen: true,
      openDelay: '1',
      fontSize: '0'
    }
  })

  it('BotUI be exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
  it('find props "version" in BotUI is create', () => {
    expect(wrapper.props().version).toContain('1')
  })
  it('find props "fontSize" in BotUI is create', () => {
    expect(wrapper.props().fontSize).toContain('0')
  })
  it('find props "isOpen" in BotUI is create', () => {
    expect(wrapper.props().isOpen).toBe(true)
  })
  it('find props "inputDisable" in BotUI is create', () => {
    expect(wrapper.props().inputDisable).toBe(true)
  })
  it('find props "botTyping" in BotUI is create', () => {
    expect(wrapper.props().botTyping).toBe(false)
  })
  it('find props "messages" in BotUI is create', () => {
    expect(wrapper.props().messages).toContain('Hello bot')
  })
})

describe('Header.vue', () => {
  const wrapper = shallowMount(Header, {
    propsData: { botTitle: '1' }
  })
  it('Header be exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
  it('find props "botTitle" in Header is create', () => {
    expect(wrapper.props().botTitle).toContain('1')
  })
  it('find methods in Header is done', () => {
    const mockFn = jest.fn()
    wrapper.setMethods({
      onClick: mockFn,
      botClose: mockFn
    })
    wrapper.find('.dropdown-item').trigger('click')
    wrapper.find('a').trigger('click')
    expect(mockFn).toBeCalled()
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})

describe('Content.vue', () => {
  const wrapper = shallowMount(Content, {
    propsData: {
      mainData: ['first', 'second'],
      botTyping: false,
      fontSize: 'fontSize'
    }
  })
  it('Content be exists', () => {
    expect(wrapper.exists()).toBe(true)
  })
  it('find props "mainData" in Content is create', () => {
    expect(wrapper.props().mainData).toContain('first')
    expect(wrapper.props().mainData).toContain('second')
  })
  it('find props "botTyping" in Content is create', () => {
    expect(wrapper.props().botTyping).toBe(false)
  })
  it('find props "fontSize" in Content is create', () => {
    expect(wrapper.props().fontSize).toContain('fontSize')
  })

  describe('Action.vue', () => {
    const wrapper = shallowMount(Action, {
      propsData: {
        inputPlaceholder: 'inputPlaceholder',
        inputDisablePlaceholder: 'inputDisablePlaceholder',
        inputDisable: false
      }
    })
    it('Action be exists', () => {
      const wrapper = shallowMount(Action)
      expect(wrapper.exists()).toBe(true)
    })
    it('find props "inputPlaceholder" in Action is create', () => {
      expect(wrapper.props().inputPlaceholder).toContain('inputPlaceholder')
    })
    it('find props "inputDisablePlaceholder" in Action is create', () => {
      expect(wrapper.props().inputDisablePlaceholder).toContain('inputDisablePlaceholder')
    })
    it('find props "inputDisable" in Action is create', () => {
      expect(wrapper.props().inputDisable).toBe(false)
    })
    it('find methods "click" in Action is done', () => {
      const mockFn = jest.fn()
      wrapper.setMethods({
        empty: mockFn,
        sendMessage: mockFn,
      })
      wrapper.find('.qkb-action-item').trigger('click')
      wrapper.find('.qkb-action-item.qkb-action-item--send').trigger('click')
      expect(mockFn).toBeCalled()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
    it('find methods "keydown.enter" in Action is done', () => {
      const mockFn = jest.fn()
      wrapper.setMethods({
        sendMessage: mockFn
      })
      wrapper.find('.qkb-board-action__input').trigger('keydown.enter')
      expect(mockFn).toBeCalled()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
    it('find methods "blur" in Action is done', () => {
      const mockFn = jest.fn()
      wrapper.setMethods({
        onBlurInput: mockFn
      })
      wrapper.find('.qkb-board-action__input').trigger('blur')
      expect(mockFn).toBeCalled()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
