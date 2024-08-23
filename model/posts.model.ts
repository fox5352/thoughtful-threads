import { Section, Thread } from "@/app/create/page";
import { Generated } from "kysely";
import { db } from "./db";

export interface PostTable {
    id: Generated<number>;
    title: string;
    tags: string[],
    user_id: number;
    user_name: string;
    sections_ids: number[]
    comments_ids: number[]
}

export interface SectionTable {
    id: Generated<number>;
    type: string;
    content: string;
}

export interface CommentTable {
    id: Generated<number>;
    post_id: number;
    content: string;
    user_id: number;
}


export async function createPost(data: Thread, user_id: number, user_name: string): Promise<number | null> {
    try {
        interface postType {
            title: string;
            tags: string[];
            user_id: number;
            user_name: string;
            sections_ids: number[];
            comments_ids: number[];
        }
    
        const postData: postType = {
            title: data.title,
            tags: data.tags,
            user_id: user_id,
            user_name: user_name,
            sections_ids: [],
            comments_ids: [],
        }
    
        const sections = data.sections
        

        sections.forEach(async sections => {
            const sectionId = await createSection(sections);
            if (sectionId) {
                postData.sections_ids.push(sectionId);
            }
        })
    
        const post_id = await db.insertInto("posts").values(postData).returning("id").executeTakeFirst();
    
        if (!post_id?.id) {
            return null;
        }

        return post_id.id;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function createSection(data: {type: string, content: string}): Promise<number | null> {
    try {
        const res = await db.insertInto("sections").values(data).returning("id").executeTakeFirst();

        if (!res?.id) {
            return null;
        }

        return res.id;
    } catch (error) {
        console.error(error);
        return null;
    }
}