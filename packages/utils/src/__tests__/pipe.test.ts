import { pipe } from '../pipe';

describe('pipe', () => {
  it('executes', () => {
    const valid = pipe(
      '1',
      (a: string) => Number(a),
      (c: number) => c + 1,
      (d: number) => `${d}`,
      (e: string) => Number(e)
    );
    expect(valid).toEqual(2);
  });
});
