import { PostShallowDataType } from "@/model/posts.model";

import React from "react";

import { Post } from "./ui/Post";
import { PageNavBar } from "./ui/PageNavBar";

async function getPosts(page=0, amount=10): Promise<PostShallowDataType[]> {    
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts?page=${page}&amount=${amount}`, {
        method: "GET",
    })

    if (res.ok) {
        const data = await res.json();
        
        if (data.body){
            return data.body;
        }
        return [];
    }
    
    return []
}

export default async function Page({searchParams}:{searchParams: {page: string, amount: string}}) {
    const page = parseInt(searchParams.page, 10) || 0;
    const amount = parseInt(searchParams.amount, 10) || 10;
    
    let posts: PostShallowDataType[] = [];
    
    posts = (await getPosts(page, amount));

    const mapper  = (post: PostShallowDataType) => {
        return (<Post key={post.id} id={post?.id} title={post.title} tags={post.tags} user_id={post.user_id} user_name={post.user_name} />)
    }

    return (
        <main className="scrollbar p-1.5 md:p-1 md:pl-2 md:pt-6 w-full max-w-7xl h-[100vh] overflow-x-hidden space-y-6 mb-6">
            {posts.length > 0 ? 
                posts.map(mapper) : 
                (<div className="flex justify-center">
                    <h2 className="text-3xl font-bold">No more posts found</h2>
                </div>)
            }
            <PageNavBar page={page} amount={amount} />
        </main>
    )
}
