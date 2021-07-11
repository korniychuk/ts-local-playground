import * as $$ from 'rxjs';
import * as $ from 'rxjs/operators';

declare namespace NodeJS {
  interface Global {
    subs?: Record<string, import('rxjs').Subscription>;
  }
}

declare const global: NodeJS.Global;

export const sub = (o$: $$.Observable<any>, name: string = 'A') => {
  const subs = global.subs = (global.subs || {});
  const sub = o$.subscribe(
    console.log.bind(console, `${ name } > NEXT:`),
    console.log.bind(console, `${ name } > ERR:`),
    console.log.bind(console, `${ name } > COMPLETE`),
  );

  if (subs[name]) subs[name].unsubscribe();
  subs[name] = sub;
};

export const rxDebug = (name: string = 'A') => <T>(o$: $$.Observable<T>): $$.Observable<T> => o$.pipe(
  $.tap({
    next: console.log.bind(console, `DEBUG > ${ name } > NEXT:`),
    error: console.log.bind(console, `DEBUG > ${ name } > ERR:`),
    complete: console.log.bind(console, `DEBUG > ${ name } > COMPLETE`),
  }),
  $.finalize(console.log.bind(console, `DEBUG > ${ name } > FINAL`)),
);
