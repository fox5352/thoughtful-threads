import dotenv from "dotenv";
dotenv.config();

import { createUser, deleteUserByID, getAllUsers, getUserByEmail, getUserById, updateUsersInterests, updateUsersName } from "./user.model";


describe("Users model", () => {
    let id: number | null = null;
    const test_user_email: string = `test@${Math.round(Math.random()*10000)}.com`;

    // Create the user once before all tests
    beforeAll(async () => {
        const userData = {
        name: 'testname',
        email: test_user_email,
        image: 'testurl',
        provider: 'test', // could be google, facebook, github, etc.
        interest: ['test'],
        };
        try {
            const success = await createUser(userData.name, userData.email, userData.image, userData.provider, userData.interest);
            if (success) {
                const user = await getUserByEmail(userData.email);
    
                if (user) {
                    id = user.id; // Save the ID for use in the tests
                }
            }
        } catch (error) {
            console.error(error);
            return
        }
        
    });

    it("get user by id", async () => {
        const user = await getUserByEmail(test_user_email);
        
        if (user) {
            const test = await getUserById(user.id);

            expect(test).toEqual(user);
        }

        expect(false);
    })

    it("get all users", async () => {
        const users = await getAllUsers();

        expect(users).toBeTruthy();
    })

    it("update users interests", async () => {
        const newInterests = ["rust", 'test'];

        const user = await getUserByEmail(test_user_email);

        if (user) {
            const success = await updateUsersInterests(user.id, newInterests);

            if (success) {
                const updatedUser = await getUserByEmail(test_user_email);

                if (updatedUser) {
                    expect(updatedUser.interest).toEqual(newInterests);
                }

                expect(updatedUser).toBeTruthy();
            }
            expect(success)
        }

        expect(false);
    })

    it("update users name", async () => {
        const newName = "updatedTestName";

        const user = await getUserByEmail(test_user_email);

        if (user) {
            const success = await updateUsersName(user.id, newName);

            if (success) {
                const updatedUser = await getUserByEmail(test_user_email);
                
                if (updatedUser) {
                    expect(updatedUser.name).toEqual(newName);
                }
                expect(updatedUser).toBeTruthy();
            }
            expect(success)
        }
        expect(false);
    });


    afterAll(async () => {
        // Delete the user after all tests
        if (id) {
            await deleteUserByID(id);
        }
    })
})

