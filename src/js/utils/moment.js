import moment from 'moment';

moment.updateLocale('ru', {
    calendar: {
        sameDay: '[Сегодня]',
        nextDay: '[Завтра]',
        lastDay: '[Вчера]',
        nextWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[В следующее] dddd';
                    case 1:
                    case 2:
                    case 4:
                        return '[В следующий] dddd';
                    case 3:
                    case 5:
                    case 6:
                        return '[В следующую] dddd';
                }
            } else {
                if (this.day() === 2) {
                    return '[Во] dddd';
                } else {
                    return '[В] dddd';
                }
            }
        },
        lastWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[В прошлое] dddd';
                    case 1:
                    case 2:
                    case 4:
                        return '[В прошлый] dddd';
                    case 3:
                    case 5:
                    case 6:
                        return '[В прошлую] dddd';
                }
            } else {
                if (this.day() === 2) {
                    return '[Во] dddd';
                } else {
                    return '[В] dddd';
                }
            }
        },
        sameElse: 'L',
    },
});
export default moment;
