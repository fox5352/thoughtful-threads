"use client"
import { IconPlus } from "@tabler/icons-react";
import { useRef } from "react";

export default function TagModel({showTagModel, func, addTag}: {showTagModel: boolean, func: (e: any | null) => void, addTag: (tag:string)=> void}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAdd = (e: any) => {
        e?.preventDefault();
        if (inputRef.current) {
            addTag(inputRef.current.value)
            func(null);
            inputRef.current.value = "";
        }
    }

    return (
        <div className={`${showTagModel ? "absolute":"hidden"} z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[205px] h-[35px]`}>
            <div className="relative px-1 py-2 h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg -z-10" />
                <div className="flex py-2 px-2 rounded-[6px] relative group transition duration-200 " >
                    <input ref={inputRef} className="flex flex-grow w-full rounded-l-[6px] px-2" />
                    <button className="bg-black text-white px-2 rounded-r-[6px]" onClick={handleAdd}><IconPlus /></button>
                </div>
            </div>
        </div>
    )
}