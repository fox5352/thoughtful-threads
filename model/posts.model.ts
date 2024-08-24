import { Section, Thread } from "@/app/create/page";
import { Generated } from "kysely";
import { db } from "./db";

export interface PostTable {
    id: Generated<number>;
    title: string;
    tags: string[];
    user_id: number;
    user_name: string;
    created_at: Generated<Date>;
}
export interface PostDataType {
    id: number;
    title: string;
    tags: string[];
    user_id: number;
    user_name: string;
    created_at: Date;
}

export interface SectionTable {
    id: Generated<number>;
    post_id: number,
    order_num: number;
    type: string;
    content: string;
}

export interface CommentTable {
    id: Generated<number>;
    post_id: number;
    user_id: number;
    content: string;
}

export async function createPost(data: Thread, user_id: number, user_name: string): Promise<number | null> {
    try {
        interface postType {
            title: string;
            tags: string[];
            user_id: number;
            user_name: string;
        }
    
        const postData: postType = {
            title: data.title,
            tags: data.tags,
            user_id: user_id,
            user_name: user_name,
        }
                
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

export async function getShallowPosts(page:number, amount:number): Promise<PostDataType[] | null> {
    try {
        const res = await db
            .selectFrom("posts")
            .orderBy("created_at asc")
            .offset(page * 10)
            .limit(amount)
            .selectAll()
            .execute();
        
        if (res) {
            return res as PostDataType[];
        }

        return null
    } catch (error) {
        console.error("Error fetching posts :", error);
        return null
    }
}

export async function getShallowPostsByTitle(title: string, page: number, amount: number): Promise<PostDataType[] | null> {
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
            return res as PostDataType[];
        }
        
        return null;
    } catch (error) {
        console.error("Error fetching posts :", error);
        return null;
    }
}

export async function getShallowPostsByUserName(userName: string, page: number, amount: number): Promise<PostDataType[] | null> {
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
            return res as PostDataType[];
        }

        return null;
    } catch (error) {
        console.error("Error fetching post :", error);
        return null;
    }
}

export async function getPostById(id:number) {
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
            }

            return postData;
        }

        return null;
    } catch (error) {
        console.error("Error fetching posts :", error);
        return null
    }
}

export async function getPostsByInterests(interests:string[], page:number, amount:number): Promise<PostDataType[] | null> {
    try {
        const res = await db
        .selectFrom("posts")
        .where("tags", "&&", interests)
        .offset(page * 10)
        .limit(amount)
        .orderBy("created_at asc")
        .selectAll()
        .execute();

        if (res) {
            return res as PostDataType[];
        }

        return null;
    } catch (error) {
        console.error("Error fetching posts by interests", error);
        return null
    }
}

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