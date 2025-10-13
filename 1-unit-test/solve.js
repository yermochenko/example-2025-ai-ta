module.exports = function(a, b, c) {
    if(a !== 0) {
        let d = b * b - 4 * a * c;
        if(d > 0) {
            let x1 = (-b - Math.sqrt(d)) / (2*a);
            let x2 = (-b + Math.sqrt(d)) / (2*a);
            return [x1, x2].sort();
        } else if(d === 0) {
            let x = -b / (2*a);
            return [x];
        } else {
            return [];
        }    
    } else {
        if(b !== 0) {
            let x = -c / b;
            return [x];    
        } else {
            if(c !== 0) {
                return [];
            } else {
                throw { name: 'IllegalArguments' };
            }
        }
    }
};
