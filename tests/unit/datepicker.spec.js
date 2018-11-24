/* eslint-env jest, node */
import { mount } from 'vue-test-utils';
import { expect } from 'chai';

import Datepicker from '@/components/DatePicker';

describe('Datepicker Calendar', () => {
  let wrapper = mount(Datepicker);


  it('should correctly re-render the calendar', () => {
    expect(wrapper.vm.show).to.equal(true);
    wrapper.vm.reRender();
    expect(wrapper.vm.isOpen).to.equal(false);

    setTimeout(() => {
      expect(wrapper.vm.isOpen).to.equal(true);
    }, 200);
  });
});

describe('Datepicker Component', () => {
  let wrapper;

  beforeEach( () => {
    wrapper = mount(Datepicker, {
      attachToDocument: true,
      propsData: {
        minNights: 3,
        disabledDates: [
          '2018-01-02',
          '2018-01-05',
          '2018-01-15',
          '2018-01-22',
          '2018-01-06',
        ]
      }
    });
  });

  it('should toggle the calendar visibility on input click', () => {
    expect(
      wrapper.vm.isOpen
    ).to.equal(false);

    const datepickerInput = wrapper.find('[data-qa="datepickerInput"]');
    datepickerInput.trigger('click');

    expect(
      wrapper.vm.isOpen
    ).to.equal(true);
  });

  it('should correctly render the next and previous months', () => {
    let activeMonthIndex = wrapper.vm.activeMonthIndex;

    wrapper.vm.renderNextMonth();
    expect(
      wrapper.vm.activeMonthIndex
    ).to.equal(activeMonthIndex + 1);

    wrapper.vm.renderPreviousMonth();
    expect(
      wrapper.vm.activeMonthIndex
    ).to.equal(activeMonthIndex);
  });

  it('should correctly parse and sort the disabled dates', () => {
    wrapper.vm.parseDisabledDates();
    expect(wrapper.vm.sortedDisabledDates).to.eql([
      new Date ('2018-01-02'),
      new Date ('2018-01-05'),
      new Date ('2018-01-06'),
      new Date ('2018-01-15'),
      new Date ('2018-01-22')
    ]);
  });
});
