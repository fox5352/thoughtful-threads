import React from "react";
import Link from "next/link";
import BookMarkButton from "./BookMarkButton";
import UserButton from "./UserButton";

export function Post({id, title, tags, user_id, user_name}: {id: number, title: string, tags: string[], user_id: number, user_name: string}) {
    return (
        <Link href={`/posts/${id}`} className="flex w-[100%] h-[140px] bg-transparent text-white p-[5px] relative">

            <div className="absolute -z-30 inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md"></div>

            <div className="w-full h-full text-white bg-black  rounded-md p-1">
                <div className="flex h-1/2 flex-col flex-grow">
                    <h3 className="text-2xl">{title}</h3>
                    <div className="flex space-x-2">
                        {tags.map((tag, idx)=> (<span className="flex px-0.5 rounded-sm bg-gradient-to-br from-[--ac-one] to-[--ac-two]" key={idx}>{tag}</span>))}
                    </div>
                </div>

                <div className="flex h-1/2 max-w-[420px] items-end flex-row">
                    <UserButton user_name={user_name} user_id={user_id} />
                    <div className="flex flex-grow">
                        <BookMarkButton title={title} id={id} />                       
                    </div>
                </div>
            </div>
        </Link>
    )
}