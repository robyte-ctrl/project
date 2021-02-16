import { pick } from './utils';

export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserRepository {
  constructor(public users: User[]) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async findOneById<S extends keyof User>(id: number, select?: readonly S[]): Promise<Pick<User, S> | null> {
    if (select && select.length === 0) {
      return null;
    }

    const user = this.users.find(it => it.id === id);
    if (!user) {
      return null;
    }

    return select
      ? pick(select, user)
      : user;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findAll<S extends keyof User>(select?: readonly S[]): Promise<Array<Pick<User, S>>> {
    if (select && select.length === 0) {
      return [];
    }

    return this.users.map(
      user => select
        ? pick(select, user)
        : { ...user },
    );
  }
}
