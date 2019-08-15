"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Bezier {
    constructor(start, ctrl0, ctrl1, end) {
        this.start = start;
        this.end = end;
        this.ctrl0 = ctrl0;
        this.ctrl1 = ctrl1;
    }
    vertex() {
        const t = .5;
        const coefficient = Math.pow(t, 3);
        const x = coefficient * (this.start.x + 3.0 * this.ctrl0.x + 3.0 * this.ctrl1.x + this.end.x);
        const y = coefficient * (this.start.y + 3.0 * this.ctrl0.y + 3.0 * this.ctrl1.y + this.end.y);
        return new Point(Number(x.toFixed(6)), Number(y.toFixed(6)));
    }
}
function recursion(position, propPath, value) {
    position += 1;
    if (/[-0-9., ]/.test(propPath[position])) {
        return recursion(position, propPath, value += propPath[position]);
    }
    return {
        position,
        value
    };
}
function findMin(arr, propName) {
    let min = arr[0][propName];
    for (let i = 0; i < arr.length; i++) {
        let tmp = Math.min(min, arr[i][propName]);
        if (tmp < min) {
            min = tmp;
        }
    }
    return min;
}
function getOffset(propPath) {
    let stack = [];
    const startPositionStack = [];
    let position = propPath.length;
    let p = 0;
    while (p < position) {
        let v = propPath[p].toLowerCase();
        if (v === 'm') {
            let { value, position: pos } = recursion(p, propPath, '');
            let pointValue = value.split(',').map((item) => Number(item));
            let point = new Point(pointValue[0], pointValue[1]);
            stack.unshift(point);
            startPositionStack.unshift(point);
            p = pos;
            continue;
        }
        if (v === 'c') {
            let { value, position: pos } = recursion(p, propPath, '');
            let besierValue = value.split(' ').filter((item) => Boolean(item));
            let ctrl0Value = besierValue[0].split(',').map((item) => Number(item));
            let ctrl1Value = besierValue[1].split(',').map((item) => Number(item));
            let endValue = besierValue[2].split(',').map((item) => Number(item));
            let start = startPositionStack[0];
            let besier = new Bezier(start, new Point(ctrl0Value[0], ctrl0Value[1]), new Point(ctrl1Value[0], ctrl1Value[1]), new Point(endValue[0], endValue[1]));
            let vertex = besier.vertex();
            stack = [
                besier.end,
                vertex
            ].concat(stack);
            startPositionStack.unshift(besier.end);
            p = pos;
            continue;
        }
        p++;
    }
    return {
        x: findMin(stack, 'x'),
        y: findMin(stack, 'y')
    };
}
;
module.exports = function getViewBoxOffset(propPath) {
    var paths = propPath.split(/ ?Z ?/i).filter((item) => Boolean(item)).map((item) => {
        return getOffset(item);
    });
    return {
        x: findMin(paths, 'x'),
        y: findMin(paths, 'y')
    };
};
