document.getElementById('dateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const startDate = new Date(document.getElementById('start_date').value);
    const region = document.getElementById('region').value;
    const holidays = getPublicHolidays(region);
    const scheduleTableBody = document.querySelector('#scheduleTable tbody');
    scheduleTableBody.innerHTML = ''; // Clear any existing schedule

    // Error handling for date range
    const minDate = new Date('2024-01-01');
    const maxDate = new Date('2026-09-01');
    if (startDate < minDate || startDate > maxDate) {
        alert('Please select a start date within the range of January 1, 2024, to September 1, 2026.');
        return;
    }

    const startDay = startDate.getDay();
    if (startDay !== 1 && startDay !== 2) {
        alert('The schedule must begin on a Monday or a Tuesday.');
        return;
    }

    generateSchedule(startDate, holidays).then(schedule => {
        let currentWeekNumber = 1;
        let previousWeekDay = null;

        schedule.forEach(date => {
            const tr = document.createElement('tr');
            const weekCell = document.createElement('td');
            const dateCell = document.createElement('td');

            // Update the week number if we moved to a new week
            if (previousWeekDay !== null && date.getDay() < previousWeekDay) {
                currentWeekNumber++;
            }

            weekCell.textContent = currentWeekNumber;
            dateCell.textContent = formatDate(date);
            tr.appendChild(weekCell);
            tr.appendChild(dateCell);
            scheduleTableBody.appendChild(tr);

            previousWeekDay = date.getDay();
        });
    });
});

function generateSchedule(startDate, holidays) {
    return new Promise(resolve => {
        let schedule = [];
        let currentDate = new Date(startDate);

        while (schedule.length < 80) {
            if (isWeekend(currentDate) || isPublicHoliday(currentDate, holidays) || isWinterBreak(currentDate)) {
                currentDate.setDate(currentDate.getDate() + 1);
                continue;
            }
            schedule.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        resolve(schedule);
    });
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

function isPublicHoliday(date, holidays) {
    return holidays.some(holiday => 
        holiday.getFullYear() === date.getFullYear() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getDate() === date.getDate()
    );
}

function isWinterBreak(date) {
    const month = date.getMonth();
    const day = date.getDate();
    // Check if the date is between 24th December and 1st January
    return (month === 11 && day >= 24) || (month === 0 && day <= 1);
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getPublicHolidays(region) {
    const irelandHolidays = [
        // 2024
        new Date('2024-01-01'), // New Year's Day
        new Date('2024-02-05'), // St. Brigid's Day
        new Date('2024-03-18'), // St. Patrick's Day (observed)
        new Date('2024-04-01'), // Easter Monday
        new Date('2024-05-06'), // May Day
        new Date('2024-06-03'), // June Bank Holiday
        new Date('2024-08-05'), // August Bank Holiday
        new Date('2024-10-28'), // October Bank Holiday
        new Date('2024-12-25'), // Christmas Day
        new Date('2024-12-26'), // St. Stephen's Day
        // 2025
        new Date('2025-01-01'), // New Year's Day
        new Date('2025-02-03'), // St. Brigid's Day
        new Date('2025-03-17'), // St. Patrick's Day
        new Date('2025-04-21'), // Easter Monday
        new Date('2025-05-05'), // May Day
        new Date('2025-06-02'), // June Bank Holiday
        new Date('2025-08-04'), // August Bank Holiday
        new Date('2025-10-27'), // October Bank Holiday
        new Date('2025-12-25'), // Christmas Day
        new Date('2025-12-26'), // St. Stephen's Day
        // 2026
        new Date('2026-01-01'), // New Year's Day
        new Date('2026-02-02'), // St. Brigid's Day
        new Date('2026-03-17'), // St. Patrick's Day
        new Date('2026-04-06'), // Easter Monday
        new Date('2026-05-04'), // May Day
        new Date('2026-06-01'), // June Bank Holiday
        new Date('2026-08-03'), // August Bank Holiday
        new Date('2026-10-26'), // October Bank Holiday
        new Date('2026-12-25'), // Christmas Day
        new Date('2026-12-28'), // St. Stephen's Day (observed)
    ];

    const englandWalesHolidays = [
        // 2024
        new Date('2024-01-01'), // New Year's Day
        new Date('2024-03-29'), // Good Friday
        new Date('2024-04-01'), // Easter Monday
        new Date('2024-05-06'), // Early May Bank Holiday
        new Date('2024-05-27'), // Spring Bank Holiday
        new Date('2024-08-26'), // Summer Bank Holiday
        new Date('2024-12-25'), // Christmas Day
        new Date('2024-12-26'), // Boxing Day
        // 2025
        new Date('2025-01-01'), // New Year's Day
        new Date('2025-04-18'), // Good Friday
        new Date('2025-04-21'), // Easter Monday
        new Date('2025-05-05'), // Early May Bank Holiday
        new Date('2025-05-26'), // Spring Bank Holiday
        new Date('2025-08-25'), // Summer Bank Holiday
        new Date('2025-12-25'), // Christmas Day
        new Date('2025-12-26'), // Boxing Day
        // 2026
        new Date('2026-01-01'), // New Year's Day
        new Date('2026-04-03'), // Good Friday
        new Date('2026-04-06'), // Easter Monday
        new Date('2026-05-04'), // Early May Bank Holiday
        new Date('2026-05-25'), // Spring Bank Holiday
        new Date('2026-08-31'), // Summer Bank Holiday
        new Date('2026-12-25'), // Christmas Day
        new Date('2026-12-28'), // Boxing Day (observed)
    ];

    return region === 'ireland' ? irelandHolidays : englandWalesHolidays;
}
