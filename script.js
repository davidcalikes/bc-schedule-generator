document.getElementById('dateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const startDate = new Date(document.getElementById('start_date').value);
    const holidaysInput = document.getElementById('holidays').value;
    const holidays = holidaysInput ? holidaysInput.split(',').map(date => new Date(date.trim())) : [];
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = ''; // Clear any existing schedule

    generateSchedule(startDate, holidays).then(schedule => {
        const ul = document.createElement('ul');
        schedule.forEach(date => {
            const li = document.createElement('li');
            li.textContent = formatDate(date);
            ul.appendChild(li);
        });
        scheduleContainer.appendChild(ul);
    });
});

function generateSchedule(startDate, holidays) {
    return new Promise(resolve => {
        let schedule = [];
        let currentDate = new Date(startDate);
        while (schedule.length < 80) {
            if (isWeekend(currentDate) || isPublicHoliday(currentDate, holidays)) {
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

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
