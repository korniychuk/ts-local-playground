import * as $$ from 'rxjs';
import * as $ from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

// const stream$ = $$.EMPTY;
// const stream$ = $$.NEVER;
// const stream$ = $$.of(111, 222, 333);
// const subj$ = new Subject(); const stream$ = subj$.pipe($.startWith(12345));
// const stream$ = new ReplaySubject(1); stream$.next(1); stream$.next(2);
// const stream$ = new BehaviorSubject(123);

const stream$ = $$.of(1234);
const v1: Promise<any> = stream$.toPromise();
const v2: Promise<any> = $$.lastValueFrom(stream$);
const v3: Promise<any> = $$.firstValueFrom(stream$);

v1.then(v => v /* ? */, e => e /* ? */); //      toPromise
v2.then(v => v /* ? */, e => e /* ? */); // firstValueFrom
v3.then(v => v /* ? */, e => e /* ? */); //  lastValueFrom
