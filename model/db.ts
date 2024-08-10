import { Kysely, PostgresDialect } from "kysely";
import { UserTabel } from "./user.model";
import { Pool } from "pg";

export interface Database {
    users: UserTabel;
};

console.log(process.env.DB_URL!);

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.DB_URL!,
        max: 4
    })
})

export const db = new Kysely<Database>({
    dialect
});

