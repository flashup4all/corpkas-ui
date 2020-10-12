
import Moment from 'moment';
export const page_range = (i, end) => {
    let range = []
    for (i; i <= end; i++) {
        range.push(i);
    }
    return range
}

export const ShortDate = (date) => {
    return Moment(date).format("D MMM YYYY");
}
export const ShortTime = (date) => {
    return Moment(date).format("hh:mm a");
}
export const MonthYear = (date) => {
    return Moment(date).format("MMM, YYYY");
}

export const FormatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
      }).format(amount)
}