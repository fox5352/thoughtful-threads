import { createPost, getShallowPosts, getShallowPostsByTitle, getShallowPostsByUserName } from "@/model/posts.model";
import { getUserByEmail } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { Thread } from "@/app/create/page";


export async function GET(req: NextRequest) {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const page = parseInt(params.get("page") || "0", 10);
    const amount = parseInt(params.get("amount") || "10", 10);

    if (params.get("title")) {
        const title = params.get("title") || ""

        const res = await getShallowPostsByTitle(title, Number(page), Number(amount));

        if (res) {
            return NextResponse.json({message: "success", body: res});
        }else {
            return NextResponse.json({message: "not found"}, {status: 404});
        }
    }else if (params.get("user")) {
        const userName = params.get("user") || ""
        
        const res = await getShallowPostsByUserName(userName, Number(page), Number(amount));

        if (res) {
            return NextResponse.json({message: "success", body: res});
        }else {
            return NextResponse.json({message: "not found"}, {status: 404});
        }
    }else {
        const res = await getShallowPosts(Number(page), Number(amount));

        if (res) {
            return NextResponse.json({message: "success", body: res});
        }else {
            return NextResponse.json({message: "not found"}, {status: 404});
        }
    }
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const session = await getServerSession();

    if (session) {
        const user = await getUserByEmail(session?.user.email);

        if (user) {
            if (data.title?.length > 0 && data.tags?.length > 0 && data.sections?.length > 0) {
                const title = data.title;
                const tags = data.tags.map((tag:string)=>tag);
                const user_id = user.id;
                const user_name = user.name;
            
                const sections = data.sections.map((section:{type:string, content:string})=> ({
                    type: section?.type,
                    content: section?.content
                }));
                
                const postData = {
                    title,
                    tags,
                    sections
                } as Thread;

                const res = await createPost(postData, user_id, user_name);
                
                if (res) {

                    return NextResponse.json({message: "Success", body: {id: res}}, {status: 201});
                }else {
                    return NextResponse.json({message: "Failed to create post"}, {status: 500});
                }
            }else {
                return NextResponse.json({message: "missing required data"}, {status: 400});
            }
        }else {
            return NextResponse.json({message: "user not found"}, {status: 404});
        }
    }else {
        return NextResponse.json({message: "user not authenticated"}, {status: 401});
    }
}