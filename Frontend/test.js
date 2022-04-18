import { shallowMount } from '@vue/test-utils'
import Nav from './src/components/Nav.vue'

const factory = (values = {}) => {
  return shallowMount(Nav, {
    data () {
      return {
      }
    }
  })
}

describe('App', () => {
  const wrapper = factory
  it('has uplode vsg', () => {
    expect(wrapper.find('.botIcon').text()).toEqual('../assets/icons/bubble.svg')
  })
  it('has a button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })
  it('')
})
