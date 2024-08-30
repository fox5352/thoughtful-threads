import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUserById } from "@/model/user.model";
// import { getShallowPostsByInterests } from "@/model/posts.model";


export async function GET(req:NextRequest) {
    try {
        const params = new URLSearchParams(req.url.split("?")[1]);
        const page = parseInt(params.get("page") || "0", 10);
        const amount = parseInt(params.get("amount") || "10", 10);
    
        const session = await getServerSession(authOptions);

        if (session && session.user.id) {
            const user_id = parseInt(session.user.id, 10);

            const user = await getUserById(user_id);

            if (user) {
                TODO:
                // const interests = ["test", "python"];// user.interest;

                const res = null;//TODO: await getShallowPostsByInterests(interests, page, amount)

                if (res) {
                    return NextResponse.json({message: "success", body: res})
                }else {
                    return NextResponse.json({message: "failed to get posts"}, {status: 500});
                }
            }else {
                return NextResponse.json({message: "failed to get user data"}, {status: 500});
            }

        }else {
            return NextResponse.json({message:"unauthorized"}, {status: 401});
        }
    } catch (error) {
        console.error("Error :", error);
        return NextResponse.json({message:"internal error"}, {status: 500});
    }
}


export async function POST(req:NextRequest) {
    return NextResponse.json({message:"not implemented"}, {status: 404});
}