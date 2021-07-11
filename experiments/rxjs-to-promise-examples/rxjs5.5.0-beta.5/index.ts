import * as $$ from 'rxjs';
import * as $ from 'rxjs/operators';

// $.toPromise()

const v: Promise<any> = $$.of(1234).toPromise();

v.then(console.log);
