import { db } from "./db";
import { Generated } from "kysely";

export interface UserTable {
    id: Generated<number>;
    name:string;
    email: string;
    image: string;
};

export interface User {
    id: number;
    name: string;
    email: string;
    image: string;
}

export async function createUser(name:string, email:string, image:string): Promise<boolean> {
    try {
        try {
            await db.insertInto("users").values({ name, email, image }).execute();
    
            return true;
        } catch (error) {
            console.error("Error creating user:", error);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getUserByEmail(email:string): Promise<User | null> {
    try {
        const user = await db.selectFrom("users").where("email", "=", email).selectAll().executeTakeFirst();

        if (user) {
            return user;
        }
    
        return null;
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function getUserById(id:number) {
    try {
        const user = await db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst();
    
        if (user) {
            return user;
        }
    
        return null;
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function getAllUsers(): Promise<User[] | null> {
    try {
        const users = db.selectFrom("users").selectAll().execute();

        if (users) {
            return users
        }
        return null
        
    } catch (error) {
        console.log(error);
        return null
    }
}

// TODO: UPDATE func
// export async function updateUserById(id:number, update: unknown) {
//     try {
//         const user = db.u
//     } catch (error) {
//         console.log(error);
//         return null
//     }
// }

export async function deleteUserByID(id:number): Promise<User | null> {
    try {
        const user = await db.deleteFrom("users").where("id", "=", id).returningAll().executeTakeFirst();

        if (user) {
            return user
        }
        return null
    } catch (error) {
        console.error(error);
        return null;
    }
}