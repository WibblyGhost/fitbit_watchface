export function padNumber(number) {
    number = number < 10 ? "0" + number : number;
    return number;
}
