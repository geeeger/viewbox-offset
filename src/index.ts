class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Bezier {
    start: Point;
    end: Point;
    ctrl0: Point;
    ctrl1: Point;
    constructor(
        start: Point,
        ctrl0: Point,
        ctrl1: Point,
        end: Point
    ) {
        this.start = start;
        this.end = end;
        this.ctrl0 = ctrl0;
        this.ctrl1 = ctrl1;
    }

    vertex(): Point {
        const t = .5;
        const coefficient = Math.pow(t, 3);
        const x = coefficient * (this.start.x + 3.0 * this.ctrl0.x + 3.0 * this.ctrl1.x + this.end.x);
        const y = coefficient * (this.start.y + 3.0 * this.ctrl0.y + 3.0 * this.ctrl1.y + this.end.y);
        return new Point(Number(x.toFixed(6)), Number(y.toFixed(6)));
    }
}

function recursion(position: number, propPath: string, value: string): any {
    position += 1;
    if (/[-0-9., ]/.test(propPath[position])) {
        return recursion(position, propPath, value += propPath[position]);
    }
    return {
        position,
        value
    };
}

function findMin(arr: Array<Point>, propName: 'x' | 'y') {
    let min = arr[0][propName];
    for (let i = 0; i < arr.length; i++) {
        let tmp = Math.min(min, arr[i][propName]);
        if (tmp < min) {
            min = tmp;
        }
    }
    return min;
}

function getOffset(propPath: string): Point {
    let stack: Array<Point> = [];
    const startPositionStack: Array<Point> = [];
    let position = propPath.length;
    let p = 0;
    while(p < position) {
        let v = propPath[p].toLowerCase();
        if (v === 'm') {
            let { value, position: pos } = recursion(p, propPath, '');
            let pointValue = value.split(',').map((item: string) => Number(item));
            let point = new Point(pointValue[0], pointValue[1]);
            stack.unshift(point);
            startPositionStack.unshift(point);
            p = pos;
            continue;
        }
        if (v === 'c') {
            let { value, position: pos } = recursion(p, propPath, '');
            let besierValue = value.split(' ').filter((item: string) => Boolean(item));
            let ctrl0Value = besierValue[0].split(',').map((item: string) => Number(item));
            let ctrl1Value = besierValue[1].split(',').map((item: string) => Number(item));
            let endValue = besierValue[2].split(',').map((item: string) => Number(item));
            let start: Point = startPositionStack[0];
            let besier = new Bezier(
                start,
                new Point(ctrl0Value[0], ctrl0Value[1]),
                new Point(ctrl1Value[0], ctrl1Value[1]),
                new Point(endValue[0], endValue[1])
            );
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
    }
};

export = function getViewBoxOffset(propPath: string): Point {
    var paths = propPath.split(/ ?Z ?/i).filter((item) => Boolean(item)).map((item) => {
        return getOffset(item);
    });
    return {
        x: findMin(paths, 'x'),
        y: findMin(paths, 'y')
    };
};
