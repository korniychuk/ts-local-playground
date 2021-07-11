import * as $$ from 'rxjs';
import * as $ from 'rxjs/operators';

// $.toPromise()

const v: Promise<any> = $$.of(1234).toPromise();

v.then(console.log);

interface User {
  name: {
    last: string;
  };
}

const user: User = {
  name: {
    last: 'Hello World',
  },
};

const v$ = $$.of(user).pipe(
  // $.pluck('name', 'last'),
  // $.map(v => v.name.last),
);
