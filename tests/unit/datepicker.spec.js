import { expect } from 'chai'
import { mount } from '@vue/test-utils'

import Datepicker from '@/DatePicker/HotelDatePicker.vue'

describe('Datepicker Calendar', () => {
  const wrapper = mount(Datepicker)

  it('should correctly re-render the calendar', () => {
    expect(wrapper.vm.show).to.equal(true)
    wrapper.vm.reRender()
    expect(wrapper.vm.isOpen).to.equal(false)

    setTimeout(() => {
      expect(wrapper.vm.isOpen).to.equal(true)
    }, 200)
  })
})

describe('Datepicker Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      attachToDocument: true,
      propsData: {
        minNights: 3,
        disabledDates: ['2020-05-28', '2020-05-10', '2020-05-01', '2020-05-22'],
      },
    })
  })

  it('should toggle the calendar visibility on input click', () => {
    expect(wrapper.vm.isOpen).to.equal(false)

    const datepickerInput = wrapper.find('[data-qa="datepickerInput"]')

    datepickerInput.trigger('click')

    expect(wrapper.vm.isOpen).to.equal(true)
  })

  it('should correctly render the next and previous months', () => {
    const { activeMonthIndex } = wrapper.vm

    wrapper.vm.renderNextMonth()
    expect(wrapper.vm.activeMonthIndex).to.equal(activeMonthIndex + 1)

    wrapper.vm.renderPreviousMonth()
    expect(wrapper.vm.activeMonthIndex).to.equal(activeMonthIndex)
  })

  it('should correctly parse and sort the disabled dates', () => {
    wrapper.vm.parseDisabledDates()
    expect(wrapper.vm.sortedDisabledDates).to.eql([
      new Date('2020-05-01'),
      new Date('2020-05-10'),
      new Date('2020-05-22'),
      new Date('2020-05-28'),
    ])
  })
})
