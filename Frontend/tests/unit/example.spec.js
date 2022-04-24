import { shallowMount } from '@vue/test-utils'
import Background from '@/components/background/Background'
import Nav from '@/components/Nav'
import BotUI from "@/components/BotUI";
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

  it('find methods in Background is done', () => {
    const mockFn = jest.fn()
    wrapper.setMethods({
      switchVersion: mockFn
    })
    wrapper.find('.carousel-control-prev').trigger('click')
    expect(mockFn).toBeCalled()
    expect(mockFn).toHaveBeenCalledTimes(1)
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

  it('Nav be exists', () => {
    const wrapper = shallowMount(Nav)
    expect(wrapper.exists()).toBe(true)
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

const app = (values = {}) => {
  return shallowMount(App, {
    data () {
      return {
        msg: {
          items: [{
            title: 'brock',
            description: '',
            image: '../assets/brock/Brock.jpg',
            link: ''
          }]
        }
      }
    }
  })
}

describe('App.vue', () => {
  it('renders props .version when passed', () => {
    const wrapper = app
    expect(wrapper.find('.items.title').text()).toEqual('brock')
  })
})
