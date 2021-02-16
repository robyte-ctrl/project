import { buildSchema, FieldNode, GraphQLSchema } from 'graphql';
import { getLogger } from 'log4js';

import type { User, UserRepository } from './user.repository';

interface UserArgs {
  id: number;
}

interface Options {
  fieldName: 'hello' | 'user' | 'users';
  fieldNodes: FieldNode[];
}

interface UserOptions extends Options {
  fieldName: 'user';
}

interface UsersOptions extends Options {
  fieldName: 'users';
}

function extractSubFields<T extends Options>(field: T['fieldName'], options: T): string[] {
  const fieldNode = options.fieldNodes.find(({ name: { value } }) => value === field);
  if (!fieldNode) {
    return [];
  }

  const subFieldsNodes = fieldNode.selectionSet?.selections.filter(({ kind }) => kind === 'Field') as FieldNode[] | undefined;
  if (!subFieldsNodes) {
    return [];
  }

  return subFieldsNodes.map(({ name: { value } }) => value);
}

export function initRootValue(userRepository: UserRepository): unknown {
  const logger = getLogger();

  return {
    hello: () => 'Hello world!',
    async user({ id }: UserArgs, req: Request, options: UserOptions) {
      const select = extractSubFields('user', options) as (keyof User)[];

      const user = await userRepository.findOneById(id, select);

      logger.info('user', { id, select, user });

      return user;
    },
    async users(args: any, req: Request, options: UsersOptions) {
      const select = extractSubFields('users', options) as (keyof User)[];

      const users = await userRepository.findAll(select);

      logger.info('users', { select, users });

      return users;
    },
  };
}

export function initSchema(): GraphQLSchema {
  return buildSchema(`
  type User {
    id: Int
    name: String
    email: String
  }

  type Query {
    hello: String
    user(id: Int = 1): User
    users: [User]
  }
`);
}
