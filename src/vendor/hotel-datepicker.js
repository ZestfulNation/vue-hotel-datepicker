import fecha from 'fecha';
import _ from 'lodash';

export default class HotelDatepicker {
    constructor(input, options) {
        // Set default values
        const opts = options || {};
        this.DatePickerID = opts.DatePickerID || null;
        this.format = opts.format || 'YYYY-MM-DD';
        this.infoFormat = opts.infoFormat || this.format;
        this.separator = opts.separator || ' - ';
        this.startOfWeek = opts.startOfWeek || 'sunday'; // Or monday
        this.startDate = opts.startDate || new Date();
        this.endDate = opts.endDate || false;
        this.minNights = opts.minNights || 1;
        this.maxNights = opts.maxNights || 0;
        this.selectForward = opts.selectForward || false;
        this.disabledDates = opts.disabledDates || [];
        this.disabledDaysOfWeek = opts.disabledDaysOfWeek || [];
        this.allowedRanges = opts.allowedRanges || null;
        this.enableCheckout = opts.enableCheckout || false;
        this.container = opts.container || '';
        this.animationSpeed = opts.animationSpeed || '.5s';
        this.hoveringTooltip = opts.hoveringTooltip || false; // Or a function
        this.autoClose = opts.autoClose === undefined ? true : opts.autoClose;
        this.showCloseButton = opts.showCloseButton || false;
        this.useDummyInputs = opts.useDummyInputs === undefined ? true : opts.useDummyInputs;
        this.i18n = opts.i18n || {
            selected: 'Your stay:',
            night: 'Night',
            nights: 'Nights',
            button: 'Close',
            'check-in': 'Check-in',
            'check-out': 'Check-out',
            'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        };
        this.getValue = opts.getValue || function () {
            return input.value;
        };
        this.setValue = opts.setValue || function (s) {
            input.value = s;
            if(this.changed) {
                //Dispatch on change event to update vue component
                var event = document.createEvent('Event');
                event.initEvent('change', true, true);
                input.dispatchEvent(event);
            }
        };

        // DOM input
        this.input = input;

        // Initialize the datepicker
        this.init();
    }

    getWeekDayNames() {
        let week = '';

        // Start from monday if we passed that option
        if (this.startOfWeek === 'monday') {
            for (let i = 0; i < 7; i++) {
                week += '<th class="datepicker__week-name">' + this.lang('day-names')[(1 + i) % 7] + '</th>';
            }

            return week;
        }

        // Otherwise start from sunday (default)
        for (let i = 0; i < 7; i++) {
            week += '<th class="datepicker__week-name">' + this.lang('day-names')[i] + '</th>';
        }

        return week;
    }

    getMonthDom(month) {
        // Get month DOM element
        return document.getElementById(this.getMonthTableId(month));
    }

    getMonthName(m) {
        // Get month name
        return this.lang('month-names')[m];
    }

    getDatepickerId() {
        // Get datepicker ID
        return 'datepicker-' + this.DatePickerID;
    }

    getMonthTableId(month) {
        // Get month table ID
        return 'month-' + month + '-' + this.DatePickerID;
    }

    getCloseButtonId() {
        // Get close button ID
        return 'close-' + this.DatePickerID;
    }

    getClearButtonId() {
        // Get close button ID
        return 'clear-' + this.DatePickerID;
    }

    getTooltipId() {
        // Get tooltip button ID
        return 'tooltip-' + this.DatePickerID;
    }

    getNextMonth(month) {
        // Get next month date
        const _m = new Date(month.valueOf());

        return new Date(_m.setMonth(_m.getMonth() + 1));
    }

    getPrevMonth(month) {
        // Get previous month date
        const _m = new Date(month.valueOf());

        return new Date(_m.setMonth(_m.getMonth() - 1));
    }

    getDateString(date, format = this.format) {
        // Format date
        return fecha.format(date, format);
    }

    parseDate(date, format = this.format) {
        // Parse a date object
        return fecha.parse(date, format);
    }

    init() {
        // Check if we should use dummy inputs or not
        if (this.useDummyInputs == true) {
            this.input.style.display = 'none';
        }
        // DOM container
        this.parent = this.container ? this.container : this.input.parentElement;

        // Start date of the selected range
        this.start = false;

        // End date of the selected range
        this.end = false;

        // Set the minimum of days required by the daterange
        this.minDays = this.minNights > 1 ? this.minNights + 1 : 2;

        // Set the maximum of days required by the daterange
        this.maxDays = this.maxNights > 0 ? this.maxNights + 1 : 0;

        // Set startDate if we passed that option
        if (this.startDate && typeof this.startDate === 'string') {
            this.startDate = this.parseDate(this.startDate);
        }

        // Set endDate if we passed that option
        if (this.endDate && typeof this.endDate === 'string') {
            this.endDate = this.parseDate(this.endDate);
        }

        // Hide tooltip on touch devices
        if (this.isTouchDevice()) {
            this.hoveringTooltip = false;
        }

        // Flag that checks if the datepicker is open
        this.isOpen = false;

        // Flag that checks if the second date of the range is set
        this.changed = true;

        // Create the DOM elements
        this.createDom();

        // Set default time
        let defaultTime = new Date();

        if (this.startDate && this.compareMonth(defaultTime, this.startDate) < 0) {
            defaultTime = this.startDate;
        }

        if (this.endDate && this.compareMonth(this.getNextMonth(defaultTime), this.endDate) > 0) {
            defaultTime = this.getPrevMonth(this.endDate);
        }

        // Show months
        this.showMonth(defaultTime, 1);
        this.showMonth(this.getNextMonth(defaultTime), 2);

        // Parse disabled dates
        if (this.disabledDates.length > 0) {
            this.parseDisabledDates();
        }

        // Attach listeners
        this.addListeners();
    }

    addListeners() {
        const self = this;

        // Next month button
        const nextButtons = this.datepicker.getElementsByClassName('datepicker__month-button--next');

        for (let i = 0; i < nextButtons.length; i++) {
            nextButtons[i].addEventListener('click', evt =>
				this.goToNextMonth_stickily(evt)
			);
        }

        // Previous month button
        const prevButtons = this.datepicker.getElementsByClassName('datepicker__month-button--prev');

        for (let i = 0; i < prevButtons.length; i++) {
            prevButtons[i].addEventListener('click', evt =>
				this.goToPreviousMonth_stickily(evt)
			);
        }

        // Open the datepicker on the input click
        this.input.addEventListener('click', evt => this.openDatepicker(evt));
        document.querySelector('#dummyWrapper' + this.getDatepickerId()).addEventListener('click', evt => this.openDatepicker(evt));

        // Close the datepicker on the button click
        document.getElementById(this.getCloseButtonId()).addEventListener('click', evt => this.closeDatepicker(evt));

        // Clear the datepicker on the button click
        document.getElementById(this.getClearButtonId()).addEventListener('click', () => this.clearSelection());

        // Close the datepicker on resize?
        // The problem is that mobile keyboards trigger the resize event closing
        // the datepicker. There are some workarounds (http://stackoverflow.com/q/14902321)
        // but for now I will disable this option. I'm open to new ideas.
        // window.addEventListener('resize', evt => this.closeDatepicker(evt));

        // Add a click event listener to the document. This will help us to:
        // 1 - Check if the click it's outside the datepicker
        // 2 - Handle the click on calendar days
        document.addEventListener('click', evt => this.documentClick(evt));

        // Add a mouseover event listener to the document. This will help us to:
        // 1 - Handle the hover on calendar days
        document.addEventListener('mouseover', evt => this.documentHover(evt));

        // Add a mouseout event listener to the document. This will help us to:
        // 1 - Hide the tooltip on the mouseout event on days
        document.addEventListener('mouseout', evt => this.documentMouseOut(evt));

        // Update the selected values when the input changes manually
        this.input.addEventListener('change', () => this.checkAndSetDefaultValue());

		// If the user presses delete or backspace, clear the selection
        document.addEventListener('keydown', KeyCheck);

        function KeyCheck(event) {
            var KeyID = event.keyCode;
            if (KeyID === 8 || KeyID === 46) {
                self.clearSelection();
            }
        }
    }

    createDom() {
        const domString = this.createDatepickerDomString();

        // Insert the datepicker in the document
        this.parent.insertAdjacentHTML('beforeend', domString);

        // Store our datepicker in a property
        this.datepicker = document.getElementById(this.getDatepickerId());
    }

    createDatepickerDomString() {
        // Generate our datepicker
        let html =
        '<button type="button" id="' + this.getClearButtonId() + '" class="datepicker__clear-button">＋</button>' +
        '<div id="' + this.getDatepickerId() + '" class="datepicker datepicker--closed">';

        html += '<div class="datepicker__inner">';

        // Months section
        html += '<div class="datepicker__months">';

		// Top bar section
        html += '<div class="datepicker__topbar' + (this.showCloseButton == true ? ' ' : ' -is-hidden') +  '">' +
					'<button type="button" id="' + this.getCloseButtonId() + '" class="datepicker__close-button">＋</button>' +
				'</div>';

        // Print single months
        for (let i = 1; i <= 2; i++) {
            html += '<table id="' + this.getMonthTableId(i) + '" class="datepicker__month datepicker__month--month' + i + '"><thead><tr class="datepicker__month-caption"><th><span class="datepicker__month-button datepicker__month-button--prev" month="' + i + '"></span></th><th colspan="5" class="datepicker__month-name"></th><th><span class="datepicker__month-button datepicker__month-button--next" month="' + i + '"></span></th></tr><tr class="datepicker__week-days">' + this.getWeekDayNames(i) + '</tr></thead><tbody></tbody></table>';
        }

        html += '</div>';

        // Tooltip
        html += '<div style="display:none" id="' + this.getTooltipId() + '" class="datepicker__tooltip"></div>';

        html += '</div>';

        html += '</div>';

        html +=
        '<div id="dummyWrapper' + this.getDatepickerId() + '" class="datepicker__dummy-wrapper '  + (this.useDummyInputs == true ? ' ' : ' -is-hidden') +  '">' +
            '<div id="' + this.getDatepickerId() + '_date1" class="datepicker__dummy-input">' + this.lang('check-in') + '</div> ' +
            '<div id="' + this.getDatepickerId() + '_date2" class="datepicker__dummy-input">' + this.lang('check-out') + '</div>' +
        '</div>';

        return html;
    }

    showMonth(date, month) {
        // Show month table and create the necessary HTML code
        const name = this.getMonthName(date.getMonth());
        const monthDom = this.getMonthDom(month);
        const monthName = monthDom.getElementsByClassName('datepicker__month-name')[0];
        const monthBody = monthDom.getElementsByTagName('tbody')[0];

        // Month caption
        monthName.textContent = name + ' ' + date.getFullYear();

        // Remove child elements before to insert the new month
        this.emptyElement(monthBody);
        // Append the month
        monthBody.insertAdjacentHTML('beforeend', this.createMonthDomString(date));

        // Check day dates
        this.updateSelectableRange();

        // Store current month dates
        this['month' + month] = date;
    }

    createMonthDomString(_date) {
        const days = [];
        let html = '';
        let valid;
        _date.setDate(1);

        let dayOfWeek = _date.getDay();
        const currentMonth = _date.getMonth();

        if ((dayOfWeek === 0) && (this.startOfWeek === 'monday')) {
            // Add one week
            dayOfWeek = 7;
        }

        // If the first day is in the middle of the week, push also
        // the first days of the week (the days before our first day).
        // We need a complete week row.
        // Obviously, these days are part of the previous month.
        if (dayOfWeek > 0) {
            for (let i = dayOfWeek; i > 0; i--) {
                const _day = new Date(_date.getTime() - (86400000 * i));

                // Check if the day is valid. And pass this property to the days object
                valid = this.isValidDate(_day.getTime());

                if ((this.startDate && this.compareDay(_day, this.startDate) < 0) || (this.endDate && this.compareDay(_day, this.endDate) > 0)) {
                    valid = false;
                }

                // We pass the type property to know if the day is part of the
                // previous month. We already know that it is true.
                days.push({
                    date: _day,
                    type: 'lastMonth',
                    day: _day.getDate(),
                    time: _day.getTime(),
                    valid
                });
            }
        }

        // Push 40 days. Each month table needs the days of the month plus
        // the remaining days (of the week row) before the first day of the month
        // and after the last day of the month. (PS. They will be hidden)
        // 40 days are enough to cover all the possibilities.
        for (let i = 0; i < 40; i++) {
            const _day = this.addDays(_date, i);

            // Check if the day is valid. And pass this property to the days object
            valid = this.isValidDate(_day.getTime());

            if ((this.startDate && this.compareDay(_day, this.startDate) < 0) || (this.endDate && this.compareDay(_day, this.endDate) > 0)) {
                valid = false;
            }

            // We pass the type property to know if the day is part of the
            // current month or part of the next month
            days.push({
                date: _day,
                type: _day.getMonth() === currentMonth ? 'visibleMonth' : 'nextMonth',
                day: _day.getDate(),
                time: _day.getTime(),
                valid
            });
        }

        // Create the week rows.
        for (let week = 0; week < 6; week++) {
            // Iterate the days object week by week.
            // If the last day is part of the next month, stop the loop.
            if (days[week * 7].type === 'nextMonth') {
                break;
            }

            // Flag for disabled dates
            let flag = 0;

            html += '<tr class="datepicker__week-row">';

            // Create the days of a week, one by one
            for (let i = 0; i < 7; i++) {
                let _day = (this.startOfWeek === 'monday') ? i + 1 : i;
                _day = days[(week * 7) + _day];
                const isToday = this.getDateString(_day.time) === this.getDateString(new Date());
                let isDisabled = false;

                // Check if the day is one of the days passed in the
                // (optional) disabledDates option. And set valid to
                // false in this case.
                if (_day.valid && (this.disabledDates.length > 0 || this.disabledDaysOfWeek.length > 0)) {
                    // if (this.end && _day.time)
                    if (this.disabledDates.indexOf(this.getDateString(_day.time, 'YYYY-MM-DD')) > -1) {
                        _day.valid = false;
                        isDisabled = true;

                        flag++;

                    }
                    else if (this.disabledDaysOfWeek.indexOf(this.getDateString(_day.time, 'dddd')) > -1) {
                        _day.valid = false;
                        isDisabled = true;

                        flag++;
                    }

                    else {
                        flag = 0;
                    }
                }

                // Each day has the "time" attribute (timestamp) and an appropriate class
                const dayAttributes = {
                    time: _day.time,
                    class: 'datepicker__month-day--' + _day.type + ' datepicker__month-day--'
					+ (_day.valid ? 'valid' : 'invalid') + ' '
					+ (isToday ? 'datepicker__month-day--today' : '') + ' '
					+ (isDisabled ? 'datepicker__month-day--disabled' : '') + ' '
					+ (isDisabled && this.enableCheckout && (flag === 1)
					? 'datepicker__month-day--checkout-enabled' : '')
                };

                // Create the day HTML
                html += '<td  width="38" height="38" class="datepicker__month-day ' + dayAttributes.class + '" ' + this.printAttributes(dayAttributes) + '>' + _day.day + '</td>';
            }

            html += '</tr>';
        }

        return html;
    }

    openDatepicker() {
        // Open the datepicker
        if (!this.isOpen) {
            // Add/remove helper classes
            this.removeClass(this.datepicker, 'datepicker--closed');
            this.addClass(this.datepicker, 'datepicker--open');
            document.querySelector('#datepicker-' + this.DatePickerID + '_date1').classList.add('datepicker__dummy-input--is-active');

            // Set (and check) the range value based on the current input value
            this.checkAndSetDefaultValue();

            // Set flag
            this.isOpen = true;

            // Show selected days in the calendar
            this.showSelectedDays();

            // Disable (if needed) the prev/next buttons
            this.disableNextPrevButtons();
        }
    }

    closeDatepicker() {
        // Close the datepicker
        if (!this.isOpen) {
            return;
        }

        // Add/remove helper classes
        this.removeClass(this.datepicker, 'datepicker--open');
        this.addClass(this.datepicker, 'datepicker--closed');

        this.isOpen = false;
    }

    autoclose() {
        // Autoclose the datepicker when the second date is set
        if (this.autoClose && this.changed && this.isOpen && this.start && this.end) {
            this.closeDatepicker();
        }
    }

    documentClick(evt) {
        // Check if the click was outside the datepicker and close it
        if (!this.parent.contains(evt.target) && evt.target !== this.input) {
            this.closeDatepicker();
        } else if (evt.target.tagName.toLowerCase() === 'td') {
            // Check if the click was on a calendar day
            this.dayClicked(evt.target);
        }
    }

    documentHover(evt) {
        // Check if the hover is on a calendar day
        if (evt.target.tagName && evt.target.tagName.toLowerCase() === 'td') {
            this.dayHovering(evt.target);
        }
    }

    documentMouseOut(evt) {
        // Check if the mouseout is on a calendar day
        if (evt.target.tagName && evt.target.tagName.toLowerCase() === 'td') {
            // Hide the tooltip
            const tooltipContainer = document.getElementById(this.getTooltipId());
            tooltipContainer.style.display = 'none';
        }
    }

    checkAndSetDefaultValue() {
        // Set range based on the input value

        // Get dates from input value
        const value = this.getValue();
        const dates = value ? value.split(this.separator) : '';

        // If we have our two dates, set the date range
        if (dates && (dates.length >= 2)) {
            // Format the values correctly
            let _format = this.format;

            if (_format.match(/Do/)) {
                _format = _format.replace(/Do/, 'D');
                dates[0] = dates[0].replace(/(\d+)(th|nd|st)/, '$1');
                dates[1] = dates[1].replace(/(\d+)(th|nd|st)/, '$1');
            }

            // Set the date range
            this.changed = false;
            this.setDateRange(this.parseDate(dates[0], _format), this.parseDate(dates[1], _format));
            this.changed = true;
        }
        //  else {
        //     const selectedInfo = this.datepicker.getElementsByClassName('datepicker__info--selected')[0];
        //     selectedInfo.style.display = 'none';
        // }
    }

    setDateRange(date1, date2) {

        // Swap dates if needed
        if (date1.getTime() > date2.getTime()) {
            let tmp = date2;

            date2 = date1;
            date1 = tmp;
            tmp = null;
        }

        let valid = true;

        // Check the validity of the dates
        if ((this.startDate && this.compareDay(date1, this.startDate) < 0) || (this.endDate && this.compareDay(date2, this.endDate) > 0)) {
            valid = false;
        }

        // If not valid, reset the datepicker
        if (!valid) {
            // Show default (initial) months
            this.showMonth(this.startDate, 1);
            this.showMonth(this.getNextMonth(this.startDate), 2);

            // Show selected days in the calendar
            this.showSelectedDays();

            // Disable (if needed) the prev/next buttons
            this.disableNextPrevButtons();

            return;
        }

        // Calculate the next month value
        this.start = date1.getTime();
        this.end = date2.getTime();

        if ((this.compareDay(date1, date2) > 0 && this.compareMonth(date1, date2) === 0)) {
            date2 = this.getNextMonth(date1);
        }

        if (this.compareMonth(date1, date2) === 0) {
            date2 = this.getNextMonth(date1);
        }

        // Show the months
        this.showMonth(date1, 1);
        this.showMonth(date2, 2);

        // Show selected days in the calendar
        this.showSelectedDays();

        // Disable (if needed) the prev/next buttons
        this.disableNextPrevButtons();

        // Check the selection
        this.checkSelection();

        // Show selected dates in top bar
        this.showSelectedInfo();

        // Close the datepicker
        this.autoclose();
    }

    showSelectedDays() {
        // Show selected days in the calendar

        // Return early if we don't have the start and end dates
        if (!this.start && !this.end) {
            return;
        }

        // Get every td in the months table: our days
        const days = this.datepicker.getElementsByTagName('td');

        // Iterate each day and assign an appropriate HTML class
        // if they are selected in the date range
        for (let i = 0; i < days.length; i++) {
            const time = parseInt(days[i].getAttribute('time'), 10);

            // Add selected class
            if ((this.start && this.end && this.end >= time && this.start <= time) || (this.start && !this.end && this.getDateString(this.start, 'YYYY-MM-DD') === this.getDateString(time, 'YYYY-MM-DD'))) {
                this.addClass(days[i], 'datepicker__month-day--selected');
            } else {
                this.removeClass(days[i], 'datepicker__month-day--selected');
            }

            // Add class to the first day of the range
            if (this.start && this.getDateString(this.start, 'YYYY-MM-DD') === this.getDateString(time, 'YYYY-MM-DD')) {
                this.addClass(days[i], 'datepicker__month-day--first-day-selected');
            } else {
                this.removeClass(days[i], 'datepicker__month-day--first-day-selected');
            }

            // Add class to the last day of the range
            if (this.end && this.getDateString(this.end, 'YYYY-MM-DD') === this.getDateString(time, 'YYYY-MM-DD')) {
                this.addClass(days[i], 'datepicker__month-day--last-day-selected');
            } else {
                this.removeClass(days[i], 'datepicker__month-day--last-day-selected');
            }
        }
    }

    showSelectedInfo() {
        // If both dates are set, show the count and set the value of our input
        if (this.start && this.end) {
            const dateRangeValue = this.getDateString(new Date(this.start)) + this.separator + this.getDateString(new Date(this.end));
            this.setValue(dateRangeValue, this.getDateString(new Date(this.start)), this.getDateString(new Date(this.end)));
            this.changed = true;
        }
    }

    dayClicked(day) {
        var startDummyInput = document.querySelector('#datepicker-' + this.DatePickerID + '_date1');
        var endDummyInput = document.querySelector('#datepicker-' + this.DatePickerID + '_date2');

        if (this.hasClass(day, 'datepicker__month-day--invalid')) {
            return;
        }

        const time = parseInt(day.getAttribute('time'), 10);
        this.addClass(day, 'datepicker__month-day--selected');

        if ((this.start && this.end) || (!this.start && !this.end)) {
            this.start = time;
            this.end = false;

            // update Dummy Input
            startDummyInput.innerHTML = this.getDateString(new Date(this.start));
            startDummyInput.classList.remove('datepicker__dummy-input--is-active');
            endDummyInput.classList.add('datepicker__dummy-input--is-active');

        } else if (this.start) {
            this.end = time;

            // update Dummy Input
            endDummyInput.innerHTML = this.getDateString(new Date(this.end));
            endDummyInput.classList.remove('datepicker__dummy-input--is-active');
        }

        // Swap dates if they are inverted
        if (this.start && this.end && this.start > this.end) {
            const tmp = this.end;

            this.end = this.start;
            this.start = tmp;
        }

        this.start = parseInt(this.start, 10);
        this.end = parseInt(this.end, 10);

        // Remove hovering class from every day and hide tooltip
        this.clearHovering();

        // Show hover
        if (this.start && !this.end) {
            // Add hovering class
            this.dayHovering(day);
        }

        // Check day dates
        this.updateSelectableRange();

        // Check the selection
        this.checkSelection();

        // Show selected dates in top bar
        this.showSelectedInfo();

        // Show selected days in the calendar
        this.showSelectedDays();

        // Close the datepicker
        this.autoclose();
    }

    isValidDate(time) {
        var self = this;

        // Check if the date is valid
        time = parseInt(time, 10);

        if ((this.startDate && this.compareDay(time, this.startDate) < 0) || (this.endDate && this.compareDay(time, this.endDate) > 0)) {
            return false;
        }

        // Update valid dates during the selection
        if (this.start && !this.end) {
            // Check maximum/minimum days
            if ((this.maxDays > 0 && this.countDays(time, this.start) > this.maxDays) || (this.minDays > 0 && this.countDays(time, this.start) < this.minDays)) {
                return false;
            }

            // Check if date is before first date of range
            if (this.selectForward && time < this.start) {
                return false;
            }

            // Check the disabled dates
            if (this.disabledDates.length > 0) {
                const limit = this.getClosestDates(new Date(parseInt(this.start, 10)));

                if (limit[0] && this.compareDay(time, limit[0]) <= 0) {
                    return false;
                }

                if (limit[1] && this.compareDay(time, limit[1]) >= 0) {
                    return false;
                }
            }

            if (this.disabledDaysOfWeek.length > 0 && this.enableCheckout === false) {
                if ( this.disabledDaysOfWeek.indexOf(this.getDateString(time, 'dddd')) > -1) {
                    return false;
                }
            }

            // when clicking on a start date, check if allowedRanges exist and allow checkout on those custom ranges
            if (this.allowedRanges.length !== 0) {
                var allowedCheckoutDays = [];

                function updateDatesByRanges(element) {
                    var someDate = new Date(self.start);
                    someDate.setDate(someDate.getDate() + element);
                    allowedCheckoutDays.push(someDate.getTime());
                }

                this.allowedRanges.forEach(updateDatesByRanges);

                if (!(_.includes(allowedCheckoutDays, time))) {
                    return false;
                }
            }
        }

        return true;
    }

    checkSelection() {
        const numberOfDays = Math.ceil((this.end - this.start) / 86400000) + 1;
        // const bar = this.datepicker.getElementsByClassName('datepicker__info--feedback')[0];

        if (this.maxDays && numberOfDays > this.maxDays) {
            this.start = false;
            this.end = false;

            // Remove selected class from each day
            const days = this.datepicker.getElementsByTagName('td');
            for (let i = 0; i < days.length; i++) {
                this.removeClass(days[i], 'datepicker__month-day--selected');
                this.removeClass(days[i], 'datepicker__month-day--first-day-selected');
                this.removeClass(days[i], 'datepicker__month-day--last-day-selected');
            }
        } else if (this.minDays && numberOfDays < this.minDays) {
            this.start = false;
            this.end = false;

            // Remove selected class from each day
            const days = this.datepicker.getElementsByTagName('td');
            for (let i = 0; i < days.length; i++) {
                this.removeClass(days[i], 'datepicker__month-day--selected');
                this.removeClass(days[i], 'datepicker__month-day--first-day-selected');
                this.removeClass(days[i], 'datepicker__month-day--last-day-selected');
            }

        }
    }

    addDays(date, days) {
        // Add xx days to date
        const result = new Date(date);

        result.setDate(result.getDate() + days);

        return result;
    }

    countDays(start, end) {
        // Return days between two dates
        return Math.abs(this.daysFrom1970(start) - this.daysFrom1970(end)) + 1;
    }

    compareDay(day1, day2) {
        // Compare two days: check if day1 is before/after/same day of day2
        const p = parseInt(this.getDateString(day1, 'YYYYMMDD'), 10) - parseInt(this.getDateString(day2, 'YYYYMMDD'), 10);

        if (p > 0) {
            return 1;
        }

        if (p === 0) {
            return 0;
        }

        return -1;
    }

    compareMonth(month1, month2) {
        // Compare two months: check if month1 is before/after/same month of month2
        const p = parseInt(this.getDateString(month1, 'YYYYMM'), 10) - parseInt(this.getDateString(month2, 'YYYYMM'), 10);

        if (p > 0) {
            return 1;
        }

        if (p === 0) {
            return 0;
        }

        return -1;
    }

    daysFrom1970(t) {
        // Get days from 1970
        return Math.floor(this.toLocalTimestamp(t) / 86400000);
    }

    toLocalTimestamp(t) {
        // Convert timestamp to local timestamp
        if (typeof t === 'object' && t.getTime) {
            t = t.getTime();
        }

        if (typeof t === 'string' && !t.match(/\d{13}/)) {
            t = this.parseDate(t).getTime();
        }

        t = parseInt(t, 10) - (new Date().getTimezoneOffset() * 60 * 1000);

        return t;
    }

    printAttributes(obj) {
        // Print object attributes in a DOM element
        const _obj = obj;
        let attribute = '';

        for (const attr in obj) {
            if (Object.prototype.hasOwnProperty.call(_obj, attr)) {
                attribute += attr + '="' + _obj[attr] + '" ';
            }
        }

        return attribute;
    }
    goToPreviousMonth_stickily(e) {
        const thisMonth = e.target.getAttribute('month');
        const isMonth2 = thisMonth > 1;
        let prevMonth = isMonth2 ? this.month2 : this.month1;

        prevMonth = this.getPrevMonth(prevMonth);
        let currentMonth = this.getNextMonth(prevMonth);

        if ((isMonth2 && this.compareMonth(prevMonth, this.month1) <= 0) || this.isMonthOutOfRange(prevMonth)) {
            return;
        }

        this.showMonth(currentMonth, 2);
        this.showMonth(prevMonth, thisMonth);
        this.showSelectedDays();
        this.disableNextPrevButtons();
    }


    goToNextMonth_stickily(e) {
        // Go to the next month
        const thisMonth = e.target.getAttribute('month');
        const isMonth2 = thisMonth > 1;
        let nextMonth = isMonth2 ? this.month2 : this.month1;

        nextMonth = this.getNextMonth(nextMonth);
        let currentMonth = this.getPrevMonth(nextMonth);

        if ((!this.isSingleMonth() && !isMonth2 && this.compareMonth(nextMonth, this.month2) >= 0)
			|| this.isMonthOutOfRange(nextMonth)) {
            return;
        }

        this.showMonth(currentMonth, 1);
        this.showMonth(nextMonth, thisMonth);
        this.showSelectedDays();
        this.disableNextPrevButtons();

    }

    goToNextMonth(e) {
        // Go to the next month
        const thisMonth = e.target.getAttribute('month');
        const isMonth2 = thisMonth > 1;
        let nextMonth = isMonth2 ? this.month2 : this.month1;

        nextMonth = this.getNextMonth(nextMonth);

        // Dont't go to the next month if:
        // 1. The second month is visible and it is the next month after
        //    our current month
        // 2. The month is after the (optional) endDate. There's no need
        //    to show other months in this case.
        if ((!this.isSingleMonth() && !isMonth2 && this.compareMonth(nextMonth, this.month2) >= 0)
			|| this.isMonthOutOfRange(nextMonth)) {
            return;
        }

        // We can now show the month and proceed
        this.showMonth(nextMonth, thisMonth);
        this.showSelectedDays();
        this.disableNextPrevButtons();
    }

    goToPreviousMonth(e) {
        // Go to the previous month
        const thisMonth = e.target.getAttribute('month');
        const isMonth2 = thisMonth > 1;
        let prevMonth = isMonth2 ? this.month2 : this.month1;

        prevMonth = this.getPrevMonth(prevMonth);

        // Dont't go to the previous month if:
        // 1. The click it's in the second month and the month we need is already
        //    shown in the first month
        // 2. The month is before the (optional) startDate. There's no need
        //    to show other months in this case.
        if ((isMonth2 && this.compareMonth(prevMonth, this.month1) <= 0) || this.isMonthOutOfRange(prevMonth)) {
            return;
        }

        // We can now show the month and proceed
        this.showMonth(prevMonth, thisMonth);
        this.showSelectedDays();
        this.disableNextPrevButtons();
    }

    isSingleMonth() {
        // Check if the second month is visible
        return !this.isVisible(this.getMonthDom(2));
    }

    isMonthOutOfRange(month) {
        const _m = new Date(month.valueOf());

        // Return true for months before the startDate and months after the endDate
        if ((this.startDate && (new Date(_m.getFullYear(), _m.getMonth() + 1, 0, 23, 59, 59) < this.startDate)) || (this.endDate && (new Date(_m.getFullYear(), _m.getMonth(), 1) > this.endDate))) {
            return true;
        }

        return false;
    }

    // Disable next/prev buttons according to the value of the prev/next
    // month. We don't want two same months at the same time!
    disableNextPrevButtons() {
        if (this.isSingleMonth()) {
            return;
        }

        const month1 = parseInt(this.getDateString(this.month1, 'YYYYMM'), 10);
        const month2 = parseInt(this.getDateString(this.month2, 'YYYYMM'), 10);
        const d = Math.abs(month1 - month2);

        const nextButton = this.datepicker.getElementsByClassName('datepicker__month-button--next')[0];
        const nextButton2 = this.datepicker.getElementsByClassName('datepicker__month-button--next')[1];

        const prevButton = this.datepicker.getElementsByClassName('datepicker__month-button--prev')[1];
        const prevButton1 = this.datepicker.getElementsByClassName('datepicker__month-button--prev')[0];


		// Lock buttons  if previous or next month are out of range
        if (this.isMonthOutOfRange(this.getPrevMonth(this.month1))) {
            this.addClass(prevButton1, 'datepicker__month-button--locked');
        } else {
            this.removeClass(prevButton1, 'datepicker__month-button--locked');
        }

        if (this.isMonthOutOfRange(this.getNextMonth(this.month2))) {
            this.addClass(nextButton2, 'datepicker__month-button--locked');
        } else {
            this.removeClass(nextButton2, 'datepicker__month-button--locked');
        }

		// Hide buttons

        if (d > 1 && d !== 89) {
            this.removeClass(nextButton, 'datepicker__month-button--disabled');
            this.removeClass(prevButton, 'datepicker__month-button--disabled');
        } else {
            this.addClass(nextButton, 'datepicker__month-button--disabled');
            this.addClass(prevButton, 'datepicker__month-button--disabled');
        }
    }

    updateSelectableRange() {
        const days = this.datepicker.getElementsByTagName('td');
        const isSelecting = this.start && !this.end;

        // Add needed classes
        for (let i = 0; i < days.length; i++) {

            if (this.hasClass(days[i], 'datepicker__month-day--invalid') && this.hasClass(days[i], 'datepicker__month-day--tmp')) {
                this.removeClass(days[i], 'datepicker__month-day--invalid');
                this.removeClass(days[i], 'datepicker__month-day--tmp');
                this.addClass(days[i], 'datepicker__month-day--valid');
            }


            // Update day classes during the date range selection
            if (isSelecting) {
                if (this.hasClass(days[i], 'datepicker__month-day--visibleMonth') &&
                    (this.hasClass(days[i], 'datepicker__month-day--valid') ||
                    this.hasClass(days[i], 'datepicker__month-day--disabled'))) {

                    const time = parseInt(days[i].getAttribute('time'), 10);
                    var minDate = new Date(this.start + (this.minNights * 86400000));

                    if (this.isValidDate(time)) {
                        this.addClass(days[i], 'datepicker__month-day--valid');
                        this.addClass(days[i], 'datepicker__month-day--tmp');
                        this.removeClass(days[i], 'datepicker__month-day--invalid');
                        this.removeClass(days[i], 'datepicker__month-day--disabled');
                    }


                    else if( this.minNights > 1 && time > this.start && time <= minDate.getTime() ) {
                        this.addClass(days[i], 'datepicker__month-day--invalid');
                        this.addClass(days[i], 'datepicker__month-day--invalid-range');
                        this.addClass(days[i], 'datepicker__month-day--tmp');
                        this.removeClass(days[i], 'datepicker__month-day--valid');
                    }

                    else {
                        this.addClass(days[i], 'datepicker__month-day--invalid');
                        this.addClass(days[i], 'datepicker__month-day--tmp');
                        this.removeClass(days[i], 'datepicker__month-day--valid');
                    }
                }
            }
        }

        return true;
    }

    dayHovering(day) {
        const hoverTime = parseInt(day.getAttribute('time'), 10);
        let tooltip = '';

        if (!this.hasClass(day, 'datepicker__month-day--invalid')) {
            // Get every td in the months table: our days
            const days = this.datepicker.getElementsByTagName('td');

            // Iterate each day and add the hovering class
            for (let i = 0; i < days.length; i++) {
                const time = parseInt(days[i].getAttribute('time'), 10);

                if (time === hoverTime) {
                    this.addClass(days[i], 'datepicker__month-day--hovering');
                } else {
                    this.removeClass(days[i], 'datepicker__month-day--hovering');
                }

                if ((this.start && !this.end) && ((this.start < time && hoverTime >= time) || (this.start > time && hoverTime <= time))) {
                    this.addClass(days[i], 'datepicker__month-day--hovering');
                } else {
                    this.removeClass(days[i], 'datepicker__month-day--hovering');
                }
            }

            // Generate date range tooltip
            if (this.start && !this.end) {
                const nights = this.countDays(hoverTime, this.start) - 1;

                if (this.hoveringTooltip) {
                    if (typeof this.hoveringTooltip === 'function') {
                        tooltip = this.hoveringTooltip(nights, this.start, hoverTime);
                    } else if (this.hoveringTooltip === true && nights > 0) {
                        const label = nights === 1 ? this.lang('night') : this.lang('nights');
                        tooltip = (nights) + ' ' + label;
                    }
                }
            }
        }

        // Show tooltip on hovering and set its position
        if (tooltip) {
            const dayBounding = day.getBoundingClientRect();
            const datepickerBounding = this.datepicker.getBoundingClientRect();
            let _left = dayBounding.left - datepickerBounding.left;
            let _top = dayBounding.top - datepickerBounding.top;

            _left += dayBounding.width / 2;

            const tooltipContainer = document.getElementById(this.getTooltipId());
            tooltipContainer.style.display = '';
            tooltipContainer.textContent = tooltip;
            const w = tooltipContainer.getBoundingClientRect().width;
            const h = tooltipContainer.getBoundingClientRect().height;

            _left -= w / 2;
            _top -= h;

            setTimeout(() => {
                tooltipContainer.style.left = _left + 'px';
                tooltipContainer.style.top = _top + 'px';
            }, 10);
        } else {
            const tooltipContainer = document.getElementById(this.getTooltipId());
            tooltipContainer.style.display = 'none';
        }
    }

    clearHovering() {
        // Remove hovering class from every day
        const days = this.datepicker.getElementsByTagName('td');
        for (let i = 0; i < days.length; i++) {
            this.removeClass(days[i], 'datepicker__month-day--hovering');
        }

        // Hide the tooltip
        const tooltipContainer = document.getElementById(this.getTooltipId());
        tooltipContainer.style.display = 'none';
    }

    clearSelection() {
        // Reset start and end dates
        this.start = false;
        this.end = false;

        // Remove selected classes
        const days = this.datepicker.getElementsByTagName('td');
        for (let i = 0; i < days.length; i++) {
            this.removeClass(days[i], 'datepicker__month-day--selected');
            this.removeClass(days[i], 'datepicker__month-day--first-day-selected');
            this.removeClass(days[i], 'datepicker__month-day--last-day-selected');
            this.removeClass(days[i], 'datepicker__month-day--invalid-range');
        }

        // Reset input
        this.setValue('');

        document.querySelector('#datepicker-' + this.DatePickerID + '_date1').innerHTML = this.lang('check-in');
        document.querySelector('#datepicker-' + this.DatePickerID + '_date2').innerHTML = this.lang('check-out');

        // Check the selection
        this.checkSelection();

        // Show selected dates in top bar
        this.showSelectedInfo();

        // Show selected days in the calendar
        this.showSelectedDays();

        //Update selectable range
        this.updateSelectableRange();
    }

    parseDisabledDates() {
        // Sort disabled dates and store it in property
        const _tmp = [];

        for (let i = 0; i < this.disabledDates.length; i++) {
            _tmp[i] = new Date(this.disabledDates[i]);
        }

        _tmp.sort((a, b) => {
            return a - b;
        });

        this.disabledDatesTime = _tmp;
    }

    getClosestDates(x) {
        // This method implements part of the work done by the user Zeta
        // http://stackoverflow.com/a/11795472

        // Return an array with two elements:
        // - The closest date on the left
        // - The closest date on the right
        let dates = [false, false];

        // If the day is before the first disabled date return early
        if (x < this.disabledDatesTime[0]) {
            // Add one day if we want include the checkout
            if (this.enableCheckout) {
                dates = [false, this.addDays(this.disabledDatesTime[0], 1)];
            // Otherwise use the first date of the array
            } else {
                dates = [false, this.disabledDatesTime[0]];
            }

        // If the day is after the last disabled date return early
        } else if (x > this.disabledDatesTime[this.disabledDatesTime.length - 1]) {
            dates = [this.disabledDatesTime[this.disabledDatesTime.length - 1], false];
        // Otherwise calculate the closest dates
        } else {
            let bestPrevDate = this.disabledDatesTime.length;
            let bestNextDate = this.disabledDatesTime.length;
            const maxDateValue = Math.abs((new Date(0, 0, 0)).valueOf());
            let bestPrevDiff = maxDateValue;
            let bestNextDiff = -maxDateValue;
            let currDiff = 0;
            let i;

            for (i = 0; i < this.disabledDatesTime.length; ++i) {
                currDiff = x - this.disabledDatesTime[i];

                if (currDiff < 0 && currDiff > bestNextDiff) {
                    bestNextDate = i;
                    bestNextDiff = currDiff;
                }

                if (currDiff > 0 && currDiff < bestPrevDiff) {
                    bestPrevDate = i;
                    bestPrevDiff = currDiff;
                }
            }

            if (this.disabledDatesTime[bestPrevDate]) {
                dates[0] = this.disabledDatesTime[bestPrevDate];
            }

            if (typeof this.disabledDatesTime[bestPrevDate] === 'undefined') {
                dates[1] = false;
            // Add one day if we want include the checkout
            } else if (this.enableCheckout) {
                dates[1] = this.addDays(this.disabledDatesTime[bestNextDate], 1);
            // Otherwise use the date of the array
            } else {
                dates[1] = this.disabledDatesTime[bestNextDate];
            }
        }

        return dates;
    }

    lang(s) {
        // Return i18n string
        return (s in this.i18n) ? this.i18n[s] : '';
    }

    emptyElement(element) {
        // Remove all child elements of a DOM node
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    // Helper regex for DOM classes
    classRegex(c) {
        return new RegExp('(^|\\s+)' + c + '(\\s+|$)');
    }

    // Check if an element has a class
    hasClass(el, c) {
        return this.classRegex(c).test(el.className);
    }

    // Add a class to the element
    addClass(el, c) {
        if (!this.hasClass(el, c)) {
            el.className = el.className + ' ' + c;
        }
    }

    // Remove class from element
    removeClass(el, c) {
        el.className = el.className.replace(this.classRegex(c), ' ');
    }

    isVisible(element) {
        // Check if a DOM element is visible
        return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    recalc(element) {
        // Force browser recalculation
        return element.offsetHeight;
    }

    isTouchDevice() {
        // This *does not* necessarily reflect a touchscreen device!!!
        // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
        return (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch));
    }

    // ------------------ //
    //   PUBLIC METHODS   //
    // ------------------ //

    open() {
        this.openDatepicker();
    }

    close() {
        this.closeDatepicker();
    }

    getDatePicker() {
        return this.datepicker;
    }

    setRange(d1, d2) {
        if (typeof d1 === 'string' && typeof d2 === 'string') {
            d1 = this.parseDate(d1);
            d2 = this.parseDate(d2);
        }

        this.setDateRange(d1, d2);
    }

    clear() {
        this.clearSelection();
    }
}
