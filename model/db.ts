import { Kysely, PostgresDialect } from "kysely";
import { UserTabel } from "./user.model";
import { Pool } from "pg";

export interface Database {
    users: UserTabel;
};

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.DB_URL!,
        // TODO: remove comment below when in prod 
        // ssl: true,
        max: 4
    })
})

export const db = new Kysely<Database>({
    dialect
});

