const c = require("./calculator");
const calculate = c.calculate
const Pipe = c.Pipe

test('3m Pipes 3/2/1m 0.02m cuts', () => {
    expect(calculate([1, 2, 3], 3, 0.02)).toStrictEqual([new Pipe(3, 3), new Pipe(3, 2), new Pipe(3, 1)]);
});

test('3m Pipes 3/2/1m 0m cuts', () => {
    expect(calculate([1, 2, 3], 3, 0)).toStrictEqual([new Pipe(3, 3), new Pipe(3, 2, 1)]);
});

test('Non-fitting 3m Pipes 4m 0.02m cuts', () => {
    expect(() => calculate([4], 3, 0.02)).toThrow("Pipes too short");
});