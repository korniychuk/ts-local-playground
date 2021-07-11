import { of } from 'rxjs/observable/of';
import * as $ from 'rxjs/operators';

const v: Promise<any> = of(123).pipe(
  // @ts-ignore
  $.toPromise(),
);

v.then(console.log);
