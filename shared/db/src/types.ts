import { Selectable, Insertable, Updateable } from "kysely";
import {
  User,
  Example,
} from "./generated/types";


export type DBUser = Selectable<User>;
export type UpdateDBUser = Updateable<User>;
export type InsertDBUser = Insertable<User>;

export type DBExample = Selectable<Example>;
export type UpdateDBExample = Updateable<Example>;
export type InsertDBExample = Insertable<Example>;

export type DBPagination = {
  page: number;
  limit: number;
  offset: number;
};