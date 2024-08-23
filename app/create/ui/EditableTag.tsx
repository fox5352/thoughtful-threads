"use client"
import { useEffect, useState, useRef } from "react";
import { IconEdit, IconTrashFilled } from "@tabler/icons-react";
import hljs from "highlight.js";
import BlobImage from "@/app/ui/BlobImage";

//  Edit Tag
export type HtmlTag = "h1"| "h2"| "h3"| "h4"| "h5"| "h6"| "p"| "code" | "image";

export type InputType = "text" | "file";

const charCapMap = {
    "h": 80,
    "p": 420,
    "c": 1260
}

export default function EditableTag({id, htmlTag, inputType, name, value, handleInput, removeSection}: {id:any, htmlTag: HtmlTag, name: string, inputType: InputType, value: string, handleInput: (e:any)=>void, removeSection: (id: any)=> void}) {
    const [isEditable, setIsEditable] = useState(false);
    const [charsLeft, setCharsLeft] = useState<number>(0)
    const inputRef = useRef<any>(null);

    //@ts-ignore
    const cap = charCapMap[htmlTag.split("")[0]];

    const handleChange = (e:any) => {
        if (e.target.value.length <= cap) {
            handleInput(e)
            setCharsLeft(cap - inputRef.current.value.length);
        }
    }

    const editTag = () => {
        setIsEditable(true);
    }

    useEffect(() => {
        const saveListener = (e: KeyboardEvent) => {                
            if (e.shiftKey && e.key === "Enter") {
                if (inputRef.current) {
                    document.body.focus();
                    inputRef.current?.removeEventListener("keypress", saveListener);
                }
                setIsEditable(false);
            }
        }

        if (isEditable) {
            inputRef.current?.focus();


            if (inputRef.current) {
                inputRef.current?.addEventListener("keypress", saveListener);
            }

        }

        document.querySelectorAll("code").forEach(e=>{
            hljs.highlightElement(e);
        });

        return () => {
            inputRef?.current?.removeEventListener("keypress", saveListener);
        }
    }, [isEditable]);

    useEffect(()=>{
        const saveOnBlur = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                document.removeEventListener("click", saveOnBlur)
                document.body.focus()
                setIsEditable(false);
            }
        };
    
        if (isEditable) {
            document.addEventListener("click", saveOnBlur);
        }
    
        return () => {
            document.removeEventListener("click", saveOnBlur);
        };
    }, [isEditable]);

    useEffect(()=>{
        if (inputRef.current) {
            setCharsLeft(cap - inputRef.current?.value.length);
        }
    })

    return (
        <div className="w-full text-3xl my-2 relative">
            {
                isEditable ?
                    <>
                        <div className="absolute right-1/2 -top-7 text-xl text-green-700">
                            <p>{charsLeft} remaining</p>
                        </div>
                        
                        {htmlTag == "p" as HtmlTag && (<textarea ref={inputRef} className="flex items-center justify-between w-full text-base p-1 outline-none border-2 border-black rounded-sm" name={name} value={value} onChange={handleChange} />) }
                        {htmlTag == "code" as HtmlTag && (<textarea ref={inputRef} className="flex items-center justify-between w-full text-base p-1 outline-none border-2 border-black rounded-sm" name={name} value={value} onChange={handleChange} />) }
                        {htmlTag.split("").includes("h")  && (<input ref={inputRef} className="flex items-center justify-between w-full outline-none border-2 border-black rounded-sm" type={inputType} name={name} value={value} onChange={handleChange} />)}

                        {htmlTag == "image" as HtmlTag && (<input ref={inputRef} className="flex items-center justify-between w-full outline-none border-2 border-black rounded-sm" type={inputType} accept=".png" name={name} onChange={(e)=>{handleInput(e); setIsEditable(false)}} />)}
                    </>
                :
                    <div className="flex items-star justify-between w-full">
                        <div className="flex items-start justify-between w-full">
                            {/* Switch block */}
                            {htmlTag == "h1" && <h1 className="text-4xl">{value}</h1>}
                            {htmlTag == "h2" && <h2 className="text-3xl">{value}</h2>}
                            {htmlTag == "h3" && <h3 className="text-2xl">{value}</h3>}
                            {htmlTag == "h4" && <h4 className="text-xl">{value}</h4>}
                            {htmlTag == "h5" && <h5 className="text-lg">{value}</h5>}
                            {htmlTag == "h6" && <h6 className="text-base">{value}</h6>}
                            {htmlTag == "p" && <p className="text-base">{value}</p>}
                            {htmlTag == "code" && (
                                <div className="flex-shrink w-[100%]">
                                    <pre className="px-2 py-1 text-base  text-wrap">
                                        <code>{value}</code>
                                    </pre>
                                </div>
                            )}
                            {htmlTag == "image" && <BlobImage className="flex w-full md:w-auto md:h-[550px] aspect-video mx-auto" alt="" blob={value} height={500} width={500} />}
                        </div>
                        
                        <div className="flex flex-col absolute right-0 md:relative pr-2">
                            <button onClick={editTag} className="text-green-600"><IconEdit /></button>
                            {name != "title" && <button onClick={()=>removeSection(id)} className="text-rose-600"><IconTrashFilled /></button>}
                        </div>
                    </div>
            }
        </div>
    )
}
