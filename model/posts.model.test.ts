import dotenv from "dotenv";
dotenv.config();

import { createPost, deletePostById, getPostById, getShallowPosts, getShallowPostsByTitle, getShallowPostsByUserName } from "./posts.model";
import { createUser, getUserByEmail } from "./user.model";


describe("Posts Model", () => {
    const test_user_email: string = `test@${Math.round(Math.random()*10000)}.com`;
    let post_id: number | null = null;  

    beforeAll(async () => {
        await createUser("test", test_user_email, "", "", []);

        const testUser = await getUserByEmail(test_user_email);
        
        if (testUser) {
            const res = await createPost({
                title: "Test Post",
                tags: ["test"],
                sections: [{ order_num: 1, type: "h2", content: "This is a test post", id: "test"}],
            },testUser!.id, testUser!.name);
            
            if (res) {
                post_id = res;
            }

        }
    });

    it("get shallow posts", async () => {
        const posts = await getShallowPosts(0, 10);
        
        expect(posts).toBeTruthy();
    })

    it("get shallow posts by title", async () => {
        const posts = await getShallowPostsByTitle("Test Post",0 , 10);
        
        expect(posts).toBeTruthy();
    })

    it("get shallow posts by user name", async () => {
        const posts = await getShallowPostsByUserName("test", 0, 10);
        
        expect(posts).toBeTruthy();
    })

    it("get posts by user id", async () => {
        if (post_id) {
            const posts = await getPostById(post_id);

            expect(posts).toBeTruthy();
        }
        expect(false);
    })

    // TODO:
    // it("get posts by interests", async () => {
    //     const interests = ["test", "python"];

    //     const posts = await getShallowPostsByInterests(interests, 0, 10);

    //     expect(posts).toBeTruthy();
    // })

    afterAll(async () => {
        if (post_id) {
            const res = await deletePostById(post_id);
            
            expect(res).toBeTruthy();
        } else {
            expect(false);
        }      
    });
})