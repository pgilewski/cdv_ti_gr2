import { logger, metrics, tracer } from '../powertools';

describe('powertools', () => {
  it('initialized', () => {
    expect(logger).toBeDefined();
    expect(metrics).toBeDefined();
    expect(tracer).toBeDefined();
  });
});
