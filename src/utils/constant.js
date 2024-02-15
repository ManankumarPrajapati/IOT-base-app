export function checkBreaker(item, page) {
    if (parseInt(item.input_3) == 1) {
        return "TRIP";
    } else if (parseInt(item.input_1) == 1) {
        return "ON";
    } else if (parseInt(item.input_1) == 0) {
        return "OFF";
    }
}

export function checkDateDifferences(date) {
    let givenDate = new Date(date);
    let currentDate = new Date();
    let differenceInMilliseconds = currentDate.getTime() - givenDate.getTime();
    if (differenceInMilliseconds > 5 * 60 * 1000) {
        return true;
    } else {
        return false;
    }
}

export function checkOneDayDifferences(date) {
    let givenDate = new Date(date);
    let currentDate = new Date();
    let differenceInMilliseconds = currentDate.getTime() - givenDate.getTime();
    if (differenceInMilliseconds > 86400 * 1000) {
        return true;
    } else {
        return false;
    }
}

export function checkColor(input1, input3) {
    if (input1 == '0' && input3 == '0') {
        return 'color-green'
    } else if (input1 == '1' && input3 == '0') {
        return 'color-red'
    } else if ((input1 == 0 || input1 == '1') && input3 == '1') {
        return 'color-yellow'
    } else {
        return ''
    }
}


export function getToken() {
    let userName = sessionStorage.getItem('access_key');
    return userName;
}

export function getUsername() {
    let userName = sessionStorage.getItem('user');
    return userName;
}

export function getUser() {
    let userName = sessionStorage.getItem('user');
    const parsedItem = JSON.parse(userName);
    const username = parsedItem.username;
    return username;
}

export var logout = () => {
    sessionStorage.clear();
    window.location.replace('/');
};

export function convertDate(date) {
    const now = new Date(date);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return dateTimeString;
}

export const getTitles = [
    "11 KV MSS#1 INCOMING FDR-3",
    "11 KV MSS#2 INCOMING FDR-7",
    "11KV 2.5 MVA TRF FDR-1",
    "11KV MSS#1 TRF FDR-2",
    "11KV MSS#2 TRF FDR-8",
    "6.6KV INCOMER1 FDR-3",
    "6.6 KV INCOMER2 FDR-7",
    "3.3 KV INCOMER1 FDR-3",
    "6.6 KV OUTGOING1 FDR-2",
    "6.6 KV OUTGOING2 FDR-8",
    "3.3 KV OUTGOING FDR-1",
    "ELECTRICAL SHOVEL",
    "BARGE-1 PUMP-1",
    "BARGE-2 PUMP-2",
    "BARGE-3 PUMP-3"
  ];