import { getPostById } from "@/model/posts.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET( req: NextRequest, { params }: { params: { id: string[] } }) {
    // Access the dynamic segments of the URL
    const id: string = params.id[0];
    if (id) {
        const cleanInt = parseInt(id, 10);
        if (cleanInt) {
            const post = await getPostById(cleanInt);

            if (post) {
                return NextResponse.json({message: "success", body: post});

            } else {
                return NextResponse.json({message: "post not found"}, {status: 404});

            }
        }else {
            return NextResponse.json({message: "failed to parse id"});

        }
    }else {
        return NextResponse.json({message: "id not provided"});

    }
}

export async function POST() {
    return NextResponse.json({message: "not yet implemented"});
}

