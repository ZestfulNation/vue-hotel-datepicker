import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import Datepicker from "@/components/DatePicker/index.vue";
import Day from "@/components/Day.vue";

let wrapper = null;
const periodDates = [
  {
    startAt: "2022-08-06",
    endAt: "2022-09-10",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-09-10",
    endAt: "2022-10-01",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-10-08",
    endAt: "2022-10-22",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-10-22",
    endAt: "2022-11-26",
    periodType: "weekly_by_saturday",
    minimumDuration: 3
  },
  {
    startAt: "2022-12-18",
    endAt: "2023-01-01",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-01-01",
    endAt: "2023-01-05",
    periodType: "nightly",
    minimumDuration: 3
  },
  {
    startAt: "2023-01-05",
    endAt: "2023-01-15",
    periodType: "nightly",
    minimumDuration: 7
  },
  {
    startAt: "2023-01-15",
    endAt: "2023-01-29",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-01-29",
    endAt: "2023-02-26",
    periodType: "nightly",
    minimumDuration: 10
  },
  {
    startAt: "2023-02-26",
    endAt: "2023-03-05",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-03-11",
    endAt: "2023-04-15",
    periodType: "weekly_by_saturday",
    minimumDuration: 3
  },
  {
    startAt: "2023-04-16",
    endAt: "2023-05-21",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-05-21",
    endAt: "2023-05-25",
    periodType: "nightly",
    minimumDuration: 2
  },
  {
    startAt: "2023-05-25",
    endAt: "2023-05-28",
    periodType: "nightly",
    minimumDuration: 3
  },
  {
    startAt: "2023-05-28",
    endAt: "2023-06-04",
    periodType: "nightly",
    minimumDuration: 7
  }
];

const testingHoveringDate = async (min, max, date, enterDate) => {
  await wrapper
    .get(`[data-testid="daywrap-${enterDate}"]`)
    .trigger("mouseenter");

  await flushPromises();

  for (let index = min; index < max; index++) {
    const endDate = index < 10 ? `0${index}` : index;

    expect(
      wrapper.get(`[data-testid="day-${date}-${endDate}"]`).classes()
    ).toContain("afterMinimumDurationValidDay");
  }
};

const mountComponent = (
  startDate = new Date("01-01-2022"),
  alwaysVisible = true
) => {
  return mount(Datepicker, {
    components: { Day },
    propsData: {
      alwaysVisible,
      countOfDesktopMonth: 2,
      minNights: 3,
      periodDates,
      startDate
    }
  });
};

afterEach(() => {
  wrapper.destroy();
});

describe("Datepicker Calendar", () => {
  it("should correctly re-render the calendar", async () => {
    wrapper = await mountComponent(new Date("01-01-2023"), false);

    expect(wrapper.vm.show).toBe(true);
    wrapper.vm.reRender();
    expect(wrapper.vm.isOpen).toBe(false);

    setTimeout(() => {
      expect(wrapper.vm.isOpen).toBe(true);
    }, 200);
  });
});

describe("Datepicker Component", () => {
  describe("Click on input", () => {
    beforeEach(async () => {
      wrapper = await mountComponent(new Date("01-01-2023"), false);
    });

    it("should toggle the calendar visibility on input click", () => {
      expect(wrapper.vm.isOpen).toBe(false);

      const datepickerInput = wrapper.find('[data-qa="datepickerInput"]');

      datepickerInput.trigger("click");

      expect(wrapper.vm.isOpen).toBe(true);
    });
  });

  describe("Click on next page", () => {
    it("should correctly render the next and previous months", () => {
      const { activeMonthIndex } = wrapper.vm;

      wrapper.vm.renderNextMonth();
      expect(wrapper.vm.activeMonthIndex).toBe(activeMonthIndex + 1);

      wrapper.vm.renderPreviousMonth();
      expect(wrapper.vm.activeMonthIndex).toBe(activeMonthIndex);
    });
  });

  describe("Periods", () => {
    describe("case 1 (3 nights min then 7 nights min) > I must be able to select from 3/01 to 10/01", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 2,
            alwaysVisible: true,
            startDate: new Date("2023-01-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-01-03"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(
          wrapper.vm.nextPeriod.minimumDurationNights
        );
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("7 Nights minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define last nextPeriodDisableDates equal to Tuesday", () => {
        // The last day disable must be a Monday to be able to output on Tuesday
        expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(1);
      });

      it("Should define nextPeriod.minimumDuration equal to 7", () => {
        expect(wrapper.vm.nextPeriod.minimumDuration).toBe(7);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 6", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-01-08"]');

        // DisableDates
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-01-10"]');

        // Possible CheckOut
        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
        expect(possibleCheckout.classes()).toContain("nightly");
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(4, 9, "2023-01", "2023-01-10");
      });
    });

    describe("case 2 (same min duration: 7 nights min then Sunday to Sunday) > I can select from 13/01 to 22/01", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 2,
            alwaysVisible: true,
            startDate: new Date("2023-01-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-01-13"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(
          wrapper.vm.nextPeriod.minimumDurationNights
        );
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define last nextPeriodDisableDates equal to Sunday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).toBe(6);
      });

      it("Should define nextPeriod.minimumDuration equal to 1", () => {
        expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 8", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(8);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-01-21"]');

        // DisableDates
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-01-22"]');

        // Possible CheckOut
        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(4, 9, "2023-01", "2023-01-22");
      });
    });

    describe("case 2 (min duration: 10 nights min > only Sunday to Sunday) > I must be able to select from 24/02 to 5/03 Sunday to Sunday takes priority over the 10 night minimum", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 4,
            alwaysVisible: true,
            startDate: new Date("2023-02-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-02-24"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define last nextPeriodDisableDates equal to Sunday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).toBe(6);
      });

      it("Should define nextPeriod.minimumDuration equal to 1", () => {
        expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 8", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(8);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-03-04"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-03-05"]');

        // Possible CheckOut
        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(25, 28, "2023-02", "2023-02-24");
        testingHoveringDate(1, 4, "2023-03", "2023-02-24");
      });
    });

    describe("case 3 (duration min night < duration Sunday to Sunday): Sunday to Sunday then 3 nights min > I can select from 25/12 to 02/01", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 4,
            alwaysVisible: true,
            startDate: new Date("2022-12-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-12-25"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define last nextPeriodDisableDates equal to Sunday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(6);
      });

      it("Should define nextPeriod.minimumDuration equal to 3", () => {
        expect(wrapper.vm.nextPeriod.minimumDuration).toBe(3);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 6", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-12-31"]');

        // DisableDates
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckoutOne = wrapper.get(
          '[data-testid="day-2023-01-01"]'
        );
        const possibleCheckoutTwo = wrapper.get(
          '[data-testid="day-2023-01-02"]'
        );

        // Possible CheckOut
        expect(possibleCheckoutOne.classes()).toContain(
          "datepicker__month-day"
        );
        expect(possibleCheckoutOne.classes()).toContain(
          "datepicker__month-day--valid"
        );
        expect(possibleCheckoutTwo.classes()).toContain(
          "datepicker__month-day"
        );
        expect(possibleCheckoutTwo.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(26, 31, "2022-12", "2022-12-25");
      });
    });

    describe("case 3 (duration min night > duration Sunday to Sunday): Sunday to Sunday then 10 nights min > I can select from 22/01 to 30/01", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 4,
            alwaysVisible: true,
            startDate: new Date("2023-01-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-01-22"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
      });

      it("Should define dynamicNightCounts to 7", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(7);
      });

      it("Should define last nextPeriodDisableDates equal to Sunday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(6);
      });

      it("Should define nextPeriod.minimumDuration equal to 10", () => {
        expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(10);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 6", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-01-28"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckoutOne = wrapper.get(
          '[data-testid="day-2023-01-29"]'
        );
        const possibleCheckoutTwo = wrapper.get(
          '[data-testid="day-2023-01-30"]'
        );

        expect(possibleCheckoutOne.classes()).toContain(
          "datepicker__month-day"
        );
        expect(possibleCheckoutOne.classes()).toContain(
          "datepicker__month-day--valid"
        );
        expect(possibleCheckoutTwo.classes()).toContain(
          "datepicker__month-day"
        );
        expect(possibleCheckoutTwo.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(23, 28, "2023-01", "2023-01-22");
      });
    });

    describe("case 4 (same min duration): saturday to saturday (min 2 weeks each period) > I can select from sept 3 to sept 17", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 4,
            alwaysVisible: true,
            startDate: new Date("2022-09-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-09-03"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(14);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("2 weeks minimum.");
      });

      it("Should define dynamicNightCounts to 14", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(14);
      });

      it("Should define last nextPeriodDisableDates equal to Thursday", () => {
        // The last day disable must be a Thursday to be able to exit on Friday
        expect(new Date(wrapper.vm.nextPeriodDisableDates[12]).getDay()).toBe(
          5
        );
      });

      it("Should define nextPeriod.minimumDuration equal to 14", () => {
        expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(14);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 6", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(13);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-09-16"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-09-17"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(4, 17, "2022-09", "2022-09-03");
      });
    });

    describe("case 4 (2 different durations): Saturday to Saturday (min 2 weeks and min 3 weeks) > I can select from 15/10 to 05/11", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 4,
            alwaysVisible: true,
            startDate: new Date("2022-10-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2022-10-15"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(21);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("3 weeks minimum.");
      });

      it("Should define dynamicNightCounts to 21", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(21);
      });

      it("Should define last nextPeriodDisableDates equal to Thursday", () => {
        // The last day disable must be a Thursday to be able to exit on Friday
        expect(new Date(wrapper.vm.nextPeriodDisableDates[19]).getDay()).toBe(
          5
        );
      });

      it("Should define nextPeriod.minimumDuration equal to 21", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(21);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 6", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(20);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2022-11-04"]');

        // DisableDates
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDay.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2022-11-05"]');

        // Possible CheckOut
        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(16, 31, "2022-10", "2022-11-05");
        testingHoveringDate(1, 4, "2022-11", "2022-11-05");
      });
    });

    describe("case 5 (Saturday to Saturday then Sunday to Sunday) > I must not be able to select from 08/04 to 16/04 but I can select from 08/04 to 30/04", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 4,
            alwaysVisible: true,
            startDate: new Date("2023-03-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-04-08"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(21);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("3 weeks minimum.");
      });

      it("Should define dynamicNightCounts to 21", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(21);
      });

      it("Should define last nextPeriodDisableDates equal to Saturday", () => {
        // The last day disable must be a Saturday to be able to output on Sunday
        expect(new Date(wrapper.vm.nextPeriodDisableDates[6]).getDay()).toBe(6);
      });

      it("Should define nextPeriod.minimumDuration equal to 21", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(21);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 21", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(21);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDayOne = wrapper.get('[data-testid="day-2023-04-16"]');
        const beforeDayTwo = wrapper.get('[data-testid="day-2023-04-23"]');
        const beforeDayThree = wrapper.get('[data-testid="day-2023-04-29"]');

        // Can't select the 2023-04-16
        expect(beforeDayOne.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDayOne.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDayOne.classes()).toContain("nightly");

        // Can't select the 2023-04-23
        expect(beforeDayTwo.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDayTwo.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDayTwo.classes()).toContain("nightly");

        // Can't select the 2023-04-29
        expect(beforeDayThree.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDayThree.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
        expect(beforeDayThree.classes()).toContain("nightly");
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-04-30"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(9, 29, "2023-04", "2023-04-30");
      });
    });

    describe("case 6 (1 period then no period): Saturday to Saturday (min 1 weeks and default minimumDuration) > I can select from 05/03 to 08/03", () => {
      beforeEach(async () => {
        wrapper = await mount(Datepicker, {
          propsData: {
            countOfDesktopMonth: 4,
            alwaysVisible: true,
            startDate: new Date("2023-03-01"),
            minNights: 3,
            periodDates
          }
        });

        const checkInDay = wrapper.get('[data-testid="day-2023-03-05"]');

        await checkInDay.trigger("click");
      });

      it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
        expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(3);
      });

      it("Should render correct text for tooltip", () => {
        expect(wrapper.vm.customTooltip).toBe("3 Nights minimum.");
      });

      it("Should define dynamicNightCounts to 0", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(0);
      });

      it("Should define nextPeriodDisableDates to []", () => {
        expect(wrapper.vm.nextPeriodDisableDates).toEqual([]);
      });

      it("Should define nextPeriod.minimumDuration equal to 0", () => {
        expect(wrapper.vm.dynamicNightCounts).toBe(0);
      });

      it("Should define nextPeriod.nextPeriodDisableDates length equal to 0", () => {
        expect(wrapper.vm.nextPeriodDisableDates.length).toBe(0);
      });

      it("Should define disabled and not-allowed class on day before possible checkout", () => {
        const beforeDay = wrapper.get('[data-testid="day-2023-03-07"]');

        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--disabled"
        );
        expect(beforeDay.classes()).toContain(
          "datepicker__month-day--not-allowed"
        );
      });

      it("Should define valid class on possible checkout day", () => {
        const possibleCheckout = wrapper.get('[data-testid="day-2023-03-08"]');

        expect(possibleCheckout.classes()).toContain("datepicker__month-day");
        expect(possibleCheckout.classes()).toContain(
          "datepicker__month-day--valid"
        );
      });

      it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {
        testingHoveringDate(6, 7, "2023-03", "2023-03-05");
      });
    });
  });
});

// 26/02/2023 => 7 jours ? il devrait être à 21 jours comme ce qu'affiche le calendrier
