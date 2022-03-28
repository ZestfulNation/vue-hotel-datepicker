import { mount } from "@vue/test-utils";
import Datepicker from "@/components/DatePicker/index.vue";

describe("Datepicker Helpers", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      attachToDocument: true,
      propsData: {
        minNights: 3,
        disabledDates: ["2020-05-28", "2020-05-10", "2020-05-01", "2020-05-22"]
      }
    });
  });

  describe("nextDateByDayOfWeek", () => {
    it("should return the next given day of the week when comparing a date to a date", () => {
      expect(
        new Date(wrapper.vm.nextDateByDayOfWeek("Saturday", "10-11-2017"))
      ).toEqual(new Date("10-14-2017"));
    });
  });

  describe("nextDateByDayOfWeekArray", () => {
    it("should return the next date when comparing to an array days of the week", () => {
      expect(
        wrapper.vm.nextDateByDayOfWeekArray(
          ["Saturday", "Tuesday"],
          "11-08-2017"
        )
      ).toEqual(new Date("11-11-2017"));
    });
  });

  describe("getNextDate", () => {
    it("should return the next day when comparing a date to a dates array", () => {
      expect(
        wrapper.vm.getNextDate(
          ["10-10-2017", "10-15-2017", "10-20-2017"],
          "10-12-2017"
        )
      ).toEqual("10-15-2017");
    });
  });

  describe("countDays", () => {
    it("should correctly count the number of days between two given dates", () => {
      expect(wrapper.vm.countDays("10-10-2017", "10-15-2017")).toEqual(5);
    });
  });

  describe("addDays", () => {
    it("should return the correct date when given a date and the amount of days to add", () => {
      expect(wrapper.vm.addDays("10-10-2017", 5)).toEqual(
        new Date("10-15-2017")
      );
    });
  });

  describe("getFirstDaySunday", () => {
    it("should return the first sunday of a given month", () => {
      expect(wrapper.vm.getFirstDay(new Date("10-10-2017"), 0)).toEqual(
        new Date("10-01-2017")
      );
    });
  });

  describe("getFirstDayMonday", () => {
    it("should return the first monday of a given month", () => {
      expect(wrapper.vm.getFirstDay(new Date("10-10-2017"), 1)).toEqual(
        new Date("09-25-2017")
      );
    });
  });

  describe("getFirstDayOfMonth", () => {
    it("should return the first sunday of a given month", () => {
      expect(wrapper.vm.getFirstDayOfMonth(new Date("12-10-2017"))).toEqual(
        new Date("12-01-2017")
      );
    });
  });

  describe("getNextMonth", () => {
    it("should return the next month of a given date", () => {
      expect(wrapper.vm.getNextMonth(new Date("12-10-2017"))).toEqual(
        new Date("01-01-2018")
      );
    });
  });
});
