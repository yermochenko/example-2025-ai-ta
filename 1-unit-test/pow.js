module.exports = function(a, n) {
    let result = 1;
    while(n) {
        result *= a;
        n--;
    }
    return result;
};
