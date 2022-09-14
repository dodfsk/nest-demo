export type Role = 'root' | 'admin' | 'user';

export enum Rolex {
  root = 'root',
  admin = 'admin',
  user = 'user',
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
