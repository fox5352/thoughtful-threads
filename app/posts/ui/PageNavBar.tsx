"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export function PageNavBar({page, amount}: {page: number, amount: number}) {
    const router = useRouter();

    const next = () => {
        const newNum = page + 1;
        router.push(`/posts?page=${newNum}&amount=${amount}`);
    }
    const prev = () => {
        const newNum = page - 1;
        router.push(`/posts?page=${newNum}&amount=${amount}`);
    }

    return (
        <div className="flex flex-shrink justify-center text-xl">
            <button onClick={prev} disabled={page<=0} className={`${page<=0? "opacity-25":""}`}><IconArrowLeft /></button>
            <span className="px-2 font-bold">{page + 1}</span>
            <button onClick={next}><IconArrowRight /></button>
        </div>
    )
}