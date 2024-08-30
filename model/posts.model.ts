import { Thread } from "@/app/create/page";
import { Generated } from "kysely";
import { db } from "./db";

export interface PostTable {
    id: Generated<number>;
    title: string;
    tags: string[];
    user_id: number;
    user_name: string;
    created_at: Generated<Date>;
};

export interface PostShallowDataType {
    id: number;
    title: string;
    tags: string[];
    user_id: number;
    user_name: string;
    created_at: Date;
};

export interface PostDataType {
    id: number;
    title: string;
    tags: string[];
    user_id: number;
    user_name: string;
    created_at: Date;
    sections: [{
            order_num: number,
            type: string;
            content: string;
        }];
}

export interface SectionTable {
    id: Generated<number>;
    post_id: number,
    order_num: number;
    type: string;
    content: string;
};

export interface CommentTable {
    id: Generated<number>;
    post_id: number;
    user_id: number;
    content: string;
};


/**
 * creates a new entry of post and related sections
 * @param {Thread} data the posts data
 * @param {number} user_id the user id
 * @param {string} user_name the user name
 * @returns {Promise<number | null>} returns post id if successful
 */
export async function createPost(data: Thread, user_id: number, user_name: string): Promise<number | null> {
    try {
        interface postType {
            title: string;
            tags: string[];
            user_id: number;
            user_name: string;
        };
    
        const postData: postType = {
            title: data.title,
            tags: data.tags,
            user_id: user_id,
            user_name: user_name,
        };
                
        const post = await db.insertInto("posts").values(postData).returning("id").executeTakeFirst();
    
        if (post?.id) {
            const sections = data.sections
            
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                
                await db.insertInto("sections").values({
                    content: section.content,
                    post_id: post.id,
                    order_num: section.order_num,
                    type: section.type
                }).execute();
            }

            return post.id;
        }


        return null;
    } catch (error) {
        console.error(error);
        
    return null;
    }
}

/**
 * Gets a shallow list of posts from database
 * @param {number} page the current page 
 * @param {number} amount the amount in a query
 * @returns {Promise<PostShallowDataType[] | null>} a list of posts if successful
 */
export async function getShallowPosts(page:number, amount:number): Promise<PostShallowDataType[] | null> {
    try {
        const res = await db
            .selectFrom("posts")
            .orderBy("created_at asc")
            .offset(page * 10)
            .limit(amount)
            .selectAll()
            .execute();
        
        if (res) {
            return res as PostShallowDataType[];
        }

        return null
    } catch (error) {
        console.error("Error fetching posts :", error);
        return null
    }
}

/**
 * Gets a shallow list of posts that contains the givin phrase
 * @param {string} title title of the post to search by
 * @param {number} page current page
 * @param {number} amount amount of posts to get
 * @returns {Promise<PostShallowDataType[] | null>} returns a shallow list of posts if successful
 */
export async function getShallowPostsByTitle(title: string, page: number, amount: number): Promise<PostShallowDataType[] | null> {
    try {
        const res = await db
            .selectFrom("posts")
            .where("title", "like", title)
            .orderBy("created_at asc")
            .offset(page * 10)
            .limit(amount)
            .selectAll()
            .execute();

        if (res) {
            return res as PostShallowDataType[];
        }
        
        return null;
    } catch (error) {
        console.error("Error fetching posts :", error);
        return null;
    }
}

/**
 * 
 * @param {string} userName user name of the post to search by
 * @param {number} page current page
 * @param {number} amount amount of posts to get
 * @returns {Promise<PostShallowDataType[] | null>} return a shallow list of posts if successful
 */
export async function getShallowPostsByUserName(userName: string, page: number, amount: number): Promise<PostShallowDataType[] | null> {
    try {
        const res = await db
            .selectFrom("posts")
            .where("user_name", "like", userName)    
            .orderBy("created_at asc")
            .offset(page * 10)
            .limit(amount)
            .selectAll()
            .execute();

        if (res) {
            return res as PostShallowDataType[];
        }

        return null;
    } catch (error) {
        console.error("Error fetching post :", error);
        return null;
    }
}

/**
 * gets a post by the id number
 * @param {number} id the id of the post
 * @returns {Promise<PostShallowDataType | null>} returns a post if successful
 */
export async function getPostById(id:number): Promise<PostDataType | null> {
    try {
        const data = await db.selectFrom("posts")
            .leftJoin("sections", "posts.id", "sections.post_id")
            .select([
                'posts.id as post_id',
                'posts.title as post_title',
                'posts.tags as post_tags',
                'posts.user_id as post_user_id',
                'posts.user_name as post_user_name',
                'created_at as post_created_at',
                'sections.id as section_id',
                'sections.order_num as section_order_num',
                'sections.type as section_type',
                'sections.content as section_content'
            ])
            .where('posts.id', '=', id)
            .execute();

            
        if (data && data.length > 0) {
            
            const postData = {
                id: data[0].post_id,
                title: data[0].post_title,
                tags: data[0].post_tags,
                user_id: data[0].post_user_id,
                user_name: data[0].post_user_name,
                sections: data.map(section=>{
                    return {
                        order_num: section.section_order_num,
                        type: section.section_type,
                        content: section.section_content
                    }
                })
            } as PostDataType;

            return postData;
        }

        return null;
    } catch (error) {
        console.error("Error fetching posts :", error);
        return null
    }
}

// TODO:
// export async function getShallowPostsByInterests(interests:string[], page:number, amount:number): Promise<PostShallowDataType[] | null> {
//     try {
//         const res = await db
//             .selectFrom("posts")
//             // .where((eb) => eb.fn('array_overlap', ['tags', eb.val(interests)]))
//             .offset(page * amount)
//             .limit(amount)
//             .orderBy("created_at", "desc")
//             .selectAll()
//             .execute();

//         if (res) {
//             return res as PostShallowDataType[];
//         }

//         return null;
//     } catch (error) {
//         console.error("Error fetching posts by interests", error);
//         return null
//     }
// }


/**
 * deletes a post by Id
 * @param id Id of the post
 * @returns {Promise<boolean>} returns a boolean value indicating whether the post was deleted
 */
export async function deletePostById(id: number): Promise<boolean> {
    try {
        const res = await db.deleteFrom("posts").where("id", "=", id).executeTakeFirst();

        if (res) {
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error deleting post :", error);
        return false;
    }
}