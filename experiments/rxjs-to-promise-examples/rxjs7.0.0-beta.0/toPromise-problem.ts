import * as $$ from 'rxjs';
import * as $ from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
}

class UsersService {
  public currentUser$: Observable<User>;
  private _currentUser$ = new BehaviorSubject({ id: 0, name: 'Unnamed' });

  public constructor() {
    this.currentUser$ = this._currentUser$.asObservable();
  }

}

const usersIns = new UsersService();

async function main(usersService: UsersService) {
  console.log('In main() ...');

  // usersService.currentUser$.subscribe(u => console.log('User via .subscribe()', u));

  const user = await usersService.currentUser$;
  console.log('User via .toPromise()', user);
}

































































main(usersIns);












































































































