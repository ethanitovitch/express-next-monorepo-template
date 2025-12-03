import { Selectable, Insertable, Updateable } from "kysely";
import {
  User,
  Example,
  Organization,
  Session,
  Account,
  Notification,
} from "./generated/types";


export type DBUser = Selectable<User>;
export type UpdateDBUser = Updateable<User>;
export type InsertDBUser = Insertable<User>;

export type DBAccount = Selectable<Account>;
export type UpdateDBAccount = Updateable<Account>;
export type InsertDBAccount = Insertable<Account>;

export type DBSession = Selectable<Session>;
export type UpdateDBSession = Updateable<Session>;
export type InsertDBSession = Insertable<Session>;

export type DBOrganization = Selectable<Organization>;
export type InsertDBOrganization = Insertable<Organization>;
export type UpdateDBOrganization = Updateable<Organization>;

export type DBExample = Selectable<Example>;
export type UpdateDBExample = Updateable<Example>;
export type InsertDBExample = Insertable<Example>;

export type DBNotification = Selectable<Notification>;
export type UpdateDBNotification = Updateable<Notification>;
export type InsertDBNotification = Insertable<Notification>;
export type CreateNotificationInput = Omit<DBNotification, 'id' | 'createdAt' | 'updatedAt'>;

export type DBPagination = {
  page: number;
  limit: number;
  offset: number;
};