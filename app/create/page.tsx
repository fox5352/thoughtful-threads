"use client";
import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

interface Thread {
    title: string;
    tags: string[];
}

export default function Page() {
    const [postData, setPostData] = useState<Thread>({
        title: "Title",
        tags: [],
    });
    const [showTagModel, setShowTagModel] = useState(false);
    const [showModel, setShowModel] = useState(false);

    const handleInput = (e: any) => {
        setPostData((prev: Thread)=>{
            return {
                ...prev,
                [e.target.name]: e.target.value,
            }
        });
    }

    const handleAddTag = (tag: string) => {
        setPostData(prev=>{
            return {
                ...prev,
                tags: [...prev.tags, tag],
            }
        })
    }

    const removeTag = (e: any) => {
        e?.preventDefault();        
        setPostData(prev=>({
            ...prev,
            tags: prev.tags.filter(t => t !== e.target.textContent)
        }))
    }

    const tagsMapper = (tag:string, index:number) => {
        return (
            <button onClick={removeTag} className="flex items-center px-4 py-1.5 bg-black text-white text-md rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg" key={`${index}`}>
                {tag}
            </button>)
    }

    const ToggleTagModel = (e: any|null) => {
        e?.preventDefault();
        setShowTagModel(!showTagModel);
    }

    const toggleModel = (e: any) => {
        e?.preventDefault();
        setShowModel(!showModel);
    }

    const submit = (e: any) => {
        e?.preventDefault();
    }

    return (
        <main className="flex pl-2 w-[1280px] py-4">
            <form className="flex w-full flex-col" onSubmit={submit}>
                {/* Title section */}
                <EditableTag name="title" htmlTag="h1" inputType="text" value={postData?.title || ""} func={handleInput} />
                {/* TAG section */}
                <div className="flex items-center justify-between flex-col gap-1 w-full my-2 relative md:flex-row">
                    <div className="flex flex-wrap w-full gap-2 md:w-auto">
                        {postData.tags.length > 0 && postData.tags.map(tagsMapper)}
                    </div>

                    <TagModel showTagModel={showTagModel} func={ToggleTagModel} addTag={handleAddTag}/>

                    <div className="flex items-center">
                        <button onClick={ToggleTagModel} className="flex p-[2px] relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                            <div className={`${showTagModel && "bg-transparent"} px-8 py-1 mt-0 bg-black rounded-[6px]  relative group transition duration-200 text-white`}>
                                {showTagModel ? <IconX />:<IconPlus />}
                            </div>
                        </button>
                    </div>
                </div>
                
                {/* Add section */}
                <button onClick={toggleModel} className="flex flex-shrink mx-auto p-[3px] relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                    <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                        Add Section
                    </div>
                </button>      
            </form>
        </main>
    )
}

// Tag model
const TagModel = ({showTagModel, func, addTag}: {showTagModel: boolean, func: (e: any | null) => void, addTag: (tag:string)=> void}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAdd = (e: any) => {
        e?.preventDefault();
        if (inputRef.current) {
            addTag(inputRef.current.value)
            func(null);
            inputRef.current.value = "";
        }
    }

    useEffect(() =>{
        if (showTagModel && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [showTagModel])

    return (
        <div className={`${showTagModel ? "absolute":"hidden"} left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-[35px]`}>
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

//  Edite Tag
type HtmlTag = "h1"| "h2"| "h3"| "h4"| "h5"| "h6"| "p"| "code";

type InputType = "text";

function EditableTag({htmlTag, inputType, name, value, func}: { htmlTag: HtmlTag, name: string, inputType: InputType, value: string, func: (e:any)=>void}) {
    const [isEditable, setIsEditable] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const editeTag = () => {
        setIsEditable(true);
    }

    const saveTag = (e: SubmitEvent) => {
        e?.preventDefault();
        setIsEditable(false);
    }

    useEffect(() => {
        if (isEditable) {
            inputRef.current?.focus();

            const saveListner = (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                    setIsEditable(false);
                    inputRef.current?.blur();
                    inputRef.current?.removeEventListener("keypress", saveListner);
                }
            }

            inputRef.current?.addEventListener("keypress", saveListner)
        }
    }, [isEditable]);

    return (
        <div className="w-full text-3xl">
            {
                isEditable ?
                    (<input ref={inputRef} className="flex items-center justify-between w-full" type={inputType} name={name} value={value} onChange={func} />)
                :
                    <div className="flex items-center justify-between w-full" onClick={editeTag}>
                        {/* Switch block */}
                        {htmlTag == "h1" && <h1 className="text-4xl">{value}</h1>}
                        {htmlTag == "h2" && <h2 className="text-3xl">{value}</h2>}
                        {htmlTag == "h3" && <h3 className="text-2xl">{value}</h3>}
                        {htmlTag == "h4" && <h4 className="text-xl">{value}</h4>}
                        {htmlTag == "h5" && <h5 className="text-lg">{value}</h5>}
                        {htmlTag == "h6" && <h6 className="text-base">{value}</h6>}
                        {htmlTag == "p" && <p>{value}</p>}
                        <span><IconEdit /></span>
                    </div>
            }
        </div>
    )
}