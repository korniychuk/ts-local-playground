interface User {
  id: number;
  email: string;
}

export interface Manager extends User {
  clientIds: number[];
  prop1: string[];
}

export interface Client extends User {
  productIds: number[];
  prop2: string[];
}

export function userHandler(user: User): void {
  console.log(user.email);
  user.clientIds;  // <-- problem
  user.productIds; // <-- problem
}
