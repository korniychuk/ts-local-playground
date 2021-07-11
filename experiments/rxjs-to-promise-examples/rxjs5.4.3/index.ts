import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/toPromise'

// of(123).pipe();
of(123).toPromise().then(console.log);
