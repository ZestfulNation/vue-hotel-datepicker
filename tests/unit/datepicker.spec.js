import { expect } from 'chai'
import { mount } from '@vue/test-utils'

import Datepicker from '@/DatePicker/HotelDatePicker.vue'

describe('Datepicker Calendar', () => {
  const wrapper = mount(Datepicker)

  it('should correctly re-render the calendar', () => {
    expect(wrapper.vm.modelValue).to.equal(true)
    wrapper.vm.reRender()
    expect(wrapper.vm.isOpen).to.equal(false)
    expect(wrapper.vm.modelValue).to.equal(true)
  })
})

describe('Datepicker Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      attachTo: document.body,
      props: {
        minNights: 3,
        disabledDates: ['2020-05-28', '2020-05-10', '2020-05-01', '2020-05-22'],
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should toggle the calendar visibility on input click', async () => {
    expect(wrapper.vm.isOpen).to.equal(false)

    const datepickerInput = wrapper.find('[data-qa="vhd__datepickerInput"]')

    await datepickerInput.trigger('click')

    expect(wrapper.vm.isOpen).to.equal(true)
  })

  it('should correctly render the next and previous months', () => {
    const { activeMonthIndex } = wrapper.vm

    wrapper.vm.renderNextMonth()
    expect(wrapper.vm.activeMonthIndex).to.equal(activeMonthIndex + 1)

    wrapper.vm.renderPreviousMonth()
    expect(wrapper.vm.activeMonthIndex).to.equal(activeMonthIndex)
  })
})
