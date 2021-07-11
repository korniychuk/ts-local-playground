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

// export type User = Manager | Client;
export type User = Manager & Client;

export function userHandler(user: User): void {
  console.log(user.email);

  const isClient = !!user.productIds;
  // const isClient = !!(user as Client).productIds;
  if (isClient) {
    // handling client

    console.log(user.productIds);
    console.log(user.prop1.join()); // problem !
  } else {
    // handling manager

    console.log(user.clientIds);
    console.log(user.prop2.join()); // problem !
  }
}
