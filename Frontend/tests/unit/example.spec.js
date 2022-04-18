import { shallowMount } from '@vue/test-utils'
import Background from '@/components/background/Background'
import Nav from '@/components/Nav'
import App from '@/App.vue'
import Vue from 'vue'
import _global_ from '@/global'
Vue.prototype.GLOBAL = _global_

const bk = (values = {}) => {
  return shallowMount(Background, {
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
    },
    propsData: { version: 'brock' }
  })
}

describe('Background.vue', () => {
  it('renders props .version when passed', () => {
    const wrapper = bk
    expect(wrapper.find('.items.title').text()).toEqual('brock')
  })
})

const nav = (values = {}) => {
  return shallowMount(Nav, {
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
    },
    propsData: { version: 'brock' }
  })
}

describe('Nav.vue', () => {
  it('renders props .version when passed', () => {
    const wrapper = nav
    expect(wrapper.find('.items.title').text()).toEqual('brock')
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
