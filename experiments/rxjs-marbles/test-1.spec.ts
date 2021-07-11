import * as $$ from 'rxjs';

describe('WallabyJS + rxjs-marbles caching bug', () => {

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('Should break cache', async () => {
    let val = 1;

    $$.timer(100, 1000).subscribe(() => val++);
    jest.advanceTimersByTime(100);
    jest.advanceTimersByTime(1000);

    expect(val).toBe(3);
  });
});
