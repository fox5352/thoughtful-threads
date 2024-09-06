"use client";
import React, {MouseEvent} from "react";
import { useRouter } from "next/navigation";

export default function UserButton({user_name, user_id}: {user_name: string, user_id: number}) {
    const router = useRouter();

    const redirect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        router.push(`/user/${user_id}`);
    }
    
    return (
        <button onClick={redirect} className="flex flex-grow">
            <h4 className="text-xl hover:text-[--ac-one] duration-150 ease-linear">{user_name}</h4>
        </button>
    )
}