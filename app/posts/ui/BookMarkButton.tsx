'use client'
import React, { MouseEvent } from "react"
import { IconBookmarkFilled } from "@tabler/icons-react";

export default function BookMarkButton({title, id}:{title:string, id: number}) {

    const saveToLocalStorage = (e: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        e?.stopPropagation();
        const data = localStorage.getItem('bookmarked');
        const bookmarked: string[] = data? JSON.parse(data): [];
        const newPost = `${title}: ${id}`;

        bookmarked.push(newPost);
        
        localStorage.setItem('bookmarked', JSON.stringify(bookmarked));
    }

    return (
        <button onClick={saveToLocalStorage} className="text-[--ac-one] hover:text-[--ac-two] duration-300 ease-linear">
            <IconBookmarkFilled />
        </button>
    )
}