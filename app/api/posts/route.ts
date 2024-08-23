import { createPost } from "@/model/posts.model";
import { getUserByEmail } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { pages } from "next/dist/build/templates/app-page";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

// TODO: implement later
export async function GET(req: NextRequest) {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const page = params.get("page") || 1;
    const limit = params.get("limit") || 10;

    if (params.get("title")) {
        // TODO: call paginated matching titles
        const title = params.get("title");
    }else if (params.get("user")) {
        // TODO: call paginated matches by user
        const userId = params.get("user");
    }else {
        // TODO: call paginated matches without any filters
    }
    
    return NextResponse.json({message: "not yet implemented"})
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const session = await getServerSession();

    if (data.title?.length > 0 && data.tags?.length > 0 && data.sections?.length > 0) {
        // TODO: clean data

        const title = data.title;
        const tags = data.tags.map((tag: string)=>tag);
        const sections = data.sections.map((section:any)=> ({
            type: section.type,
            content: section.content
        }))

        const postData = {
            title,
            tags,
            sections,
        };
        

        if (!session) {
            return NextResponse.json({message: "user not authenticated"}, {status: 401});
        }
    
        const userData = await getUserByEmail(session.user.email);
    
        if (!userData) {
            return NextResponse.json({message: "user not found"}, {status: 404});
        }

        const id  = await createPost(postData, userData.id, userData.name);

        if (id) {
            return NextResponse.json({message: "Success", body: {id}}, {status: 404});
        }
        
        return NextResponse.json({message: "Failed to create post"}, {status: 500});
    }

    
    return NextResponse.json({message: "malformed data"}, {status: 400});
}