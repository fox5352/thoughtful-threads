import { db } from "./db";
import { Generated } from "kysely";

export interface UserTable {
    id: Generated<number>;
    name:string;
    email: string;
    image: string;
    interest: string[],
    provider: string,
};

export interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    interest: string[],
    provider: string,
};

export async function createUser(name:string, email:string, image:string, provider:string, interest: string[]): Promise<boolean> {
    try {
        try {
            await db.insertInto("users").values({ name, email, image, interest, provider}).execute();
            
            return true;
        } catch (error) {
            console.error("Error creating user:", error);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

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

export async function updateUsersInterests(id:number, interests: string[]): Promise<boolean> {
    try {
        const res = await db.updateTable("users").set({ interest: interests }).where("id", "=", id).executeTakeFirst();

        if (res) {
            return true;
        }

        return false;
    } catch (error) {
        console.error("failed to update users interests :", error);
        return false
    }
}

export async function updateUsersName(id:number, userName:string): Promise<boolean> {
    try {
        const res = await db.updateTable("users").set({name: userName}).where("id", "=", id).executeTakeFirst();

        if (res) {
            return true;
        }

        return false;
    } catch (error) {
        console.error("failed to update users name :", error);
        return false;
    }
}

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