import moment from "moment";
import Holidays from 'date-holidays';


function getCombinedHolidays(date1, date2) {
    const year1 = moment(date1)
    const year2 = moment(date2)
    const holidays = new Holidays('ZW')
    const combinedHolidays = []
    const holidays1 = holidays.getHolidays(year1.year())
    const holidays2 = holidays.getHolidays(year2.year())
    if (year2.year() > year1.year()) {
        holidays1.forEach(holiday => combinedHolidays.push(moment(holiday.date)))
        holidays2.forEach(holiday => combinedHolidays.push(moment(holiday.date)))
        return combinedHolidays
    }
    else {
        holidays2.forEach(holiday => combinedHolidays.push(moment(holiday.date)))
        return combinedHolidays;
    }
}

function zimHolidays(date1, date2) {
    const hd = new Holidays('ZW');
    let holidays = getCombinedHolidays(date1, date2)

    let holidayDays = []
    for (let j = 0; j < holidays.length; j++) {
        if (moment(holidays[j]).isBetween(date1, date2) || moment(holidays[j]).isSame(date1, 'day') || moment(holidays[j]).isSame(date2, 'day')) {
            let hasSunday = holidays[j].day() == 0
            let hasSaturday = holidays[j].day() == 6
            if (hasSunday) {
                let nextHoliday = (holidays[j + 1]);
                if (moment(nextHoliday).day() === 1) {
                    if (moment(nextHoliday).isBefore(date2)) {
                        holidayDays.push(holidays[j].add(2, 'days').format('YYYY-MM-DD'))
                    }
                }
                else {
                    holidayDays.push(holidays[j].add(1, 'day').format('YYYY-MM-DD'))
                }
            }
            else if (hasSaturday) {

            }
            else {
                holidayDays.push(holidays[j].format('YYYY-MM-DD'))
            }
        }
    }
    return holidayDays
}

function getWeekendsInRange(date1, date2) {
    const d1 = moment(date1).startOf('day');
    const d2 = moment(date2).startOf('day');
    const weekends = [];

    let currentDate = moment(d1).startOf('week');
    while (currentDate.isSameOrBefore(d2)) {
        if (currentDate.day() === 6 || currentDate.day() === 0) {
            weekends.push(moment(currentDate).format('YYYY-MM-DD'));
        }
        currentDate.add(1, 'day');
    }

    for (let i = 0; i < weekends.length; i++) {
        if (d1.isAfter(weekends[i])) {
            weekends.splice(i, 1)
        }
        return weekends
    }
}


function calculateDays(date1, date2) {
    let d1 = moment(date1), d2 = moment(date2)
    var holidays = zimHolidays(date1, date2);
    var weekends = getWeekendsInRange(date1, date2);
    let days = Math.abs(d2.diff(d1, 'days')) + 1;
    let daysExcludingWeekends = days - weekends.length;
    let daysExcludingWeekendsAndHolidays = daysExcludingWeekends - holidays.length

    return daysExcludingWeekendsAndHolidays;
}

export default function getDateDiff(date1, date2) {

    console.log(zimHolidays(date1, date2))
    return calculateDays(date1, date2)

}

