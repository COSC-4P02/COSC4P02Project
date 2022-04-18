import { shallowMount } from '@vue/test-utils'
import Background from '@/components/background/Background'

describe('Background.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(Background, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
