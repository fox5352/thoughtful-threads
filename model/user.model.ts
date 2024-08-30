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

/**
 * Creates a new User in the database
 * @param {string} name user name
 * @param {string} email user email (has to be unique)
 * @param {string} image url to image
 * @param {string} provider provider used
 * @param {string[]} interest array of interest
 * @returns {Promise<boolean>} returns true if successful
 */
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

/**
 * Gets the users data by email
 * @param email users email address
 * @returns {Promise<User | null>} User object if successful
 */
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

/**
 * Gets the user by id
 * @param id user account id
 * @returns {Promise<User | null>} User object if successful
 */
export async function getUserById(id:number): Promise<User | null> {
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

/**
 * Gets all users from the database
 * @returns {Promise<User[]| null>} Gets all users from the database and returns them if successful
 */
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

/**
 * Gets user By id and updates interests by with the provided interest
 * @param {number} id Users Id
 * @param {string[]} interests Array of interest
 * @returns {Promise<Boolean>} returns Promise boolean value
 */
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


/**
 * Gets user by id and updates name with provided userName
 * @param {number} id User Id
 * @param {string} userName users name
 * @returns {Promise<boolean>} Returns Promise boolean
 */
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


/**
 * Delete a user by id 
 * @param {number} id User id
 * @returns {Promise<boolean>} return true if successful
 */
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