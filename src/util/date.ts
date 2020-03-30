export function dateSecondsDifference(greaterDate: Date, date: Date) {
    let diff = greaterDate.getTime() - date.getTime();
    diff = Math.round((diff / 1000));
    return diff;
}

export function dateMinuteDifference(greaterDate: Date, date: Date) {
    return dateSecondsDifference(greaterDate, date) / 60;
}

export function dateHourDifference(greaterDate: Date, date: Date) {
    return dateMinuteDifference(greaterDate, date) / 60;
}

export function getDateTimeFormat(date: Date) {
    let day: any = date.getDate();
    let month: any = date.getMonth() + 1;

    const year = date.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    const dateString = day + '.' + month + '.' + year;
    return `${dateString} ${date.toTimeString().split(' ')[0]}`;
}
