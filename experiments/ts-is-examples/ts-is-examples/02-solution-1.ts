import * as _ from 'lodash';

_.isNumber

interface BaseUser {
  id: number;
  email: string;
}

export interface Manager extends BaseUser {
  clientIds: number[];
  prop1: string[];
}

export interface Client extends BaseUser {
  productIds: number[];
  prop2: string[];
}

export type User = Manager | Client;
// export type User = Manager & Client;

export function isClient(user: User): user is Client {
  return !!(user as Client).productIds;
}

export function isManager(user: User): user is Manager {
  return !!(user as Manager).clientIds;
}

export function userHandler(user: User): void {
  console.log(user.email);

  if (isClient(user)) {
    // handling client

    console.log(user.productIds);
    console.log(user.prop1.join()); // problem highlighted!
    console.log(user.prop2.join());
  } else {
    // handling manager

    console.log(user.clientIds);
    console.log(user.prop2.join()); // problem highlighted!
    console.log(user.prop1.join());
  }
}
