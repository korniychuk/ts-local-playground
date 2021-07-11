import * as $$ from 'rxjs';
import * as $ from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

describe('RxJS Marbles Testing', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  // it('Test One', () => {
  //   testScheduler.run(({ cold, expectObservable }) => {
  //     // const source$ = $$.of('a', 'b', 'c');
  //     // const expected = '(abc|)';
  //     const source$ = cold('--a-b--c');
  //     const expected =     '--a-b--c';
  //     expectObservable(source$).toBe(expected);
  //   });
  // });

  // it('test hot', () => {
  //   testScheduler.run(({ cold, hot, expectObservable }) => {
  //     const source$ = hot('--a-b^-c-|');
  //     const expected =        ' --c-|';
  //     expectObservable(source$).toBe(expected);
  //   });
  // });

  // it('time progression syntax', () => {
  //   testScheduler.run(({ cold, hot, expectObservable }) => {
  //     const source$ = $$.of(1, 2, 3, 4, 5);
  //     const final$ = source$.pipe($.delay(202));
  //     const expected = '- 0.2s -(abcde|)';
  //
  //     expectObservable(final$).toBe(expected, { a: 1, b: 2, c: 3, d: 4, e: 5 });
  //   });
  // });

  // it('Should let you test errors and error messages', () => {
  //   testScheduler.run(({ expectObservable }) => {
  //     const source$ = $$.of({ firstName: 'Brian', lastName: 'Smith' }, null).pipe(
  //       $.map(o => `${ o!.firstName } ${ o!.lastName }`),
  //       // $.catchError(() => {
  //       //   throw new Error('Invalid User');
  //       // }),
  //       $.catchError(() => $$.throwError(new Error('Invalid User'))),
  //     );
  //     const expected = '(a#)';
  //
  //     expectObservable(source$).toBe(expected, { a: 'Brian Smith' }, new Error('Invalid User'));
  //   });
  // });

  it('no marbles', () => {
    const source$ = $$.of(1, 2, 3);
    const final$ = source$.pipe(
      $.map(v => v * 10),
    );
    const expected = [10, 20, 30];
    let index = 0;
    const results: number[] = [];

    final$.subscribe(v => {
      // results.push(v);
      expect(v /* ? */).toEqual(expected[index++] /* ? */);
    });
    //
    // expect(results).toEqual(expected);
  });

});
