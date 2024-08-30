import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { UserTable as UserTable } from "./user.model";
import { PostTable, SectionTable, CommentTable } from "./posts.model";

export interface Database {
    users: UserTable;
    sections: SectionTable;
    posts: PostTable;
    comments: CommentTable;
};

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.DB_URL!,
        // ssl: true,
        max: 4
    })
});


/**
 * returns a database connections
 * @returns {Kysely<Database>} db object 
 */
export const db = new Kysely<Database>({
    dialect
});

