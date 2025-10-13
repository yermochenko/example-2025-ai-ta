// функция вычисляет количество цифр числа
module.exports = function(n) {
    let k = 0;
    while(n) {
        k++;
        n /= 10;
    }
    return k;
};
