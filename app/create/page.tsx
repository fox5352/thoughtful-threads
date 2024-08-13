"use client";
import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Thread {
    title: string;
    tags: string[];
    sections: Section[];
}

interface Section {
    id: string;
    type: HtmlTag;
    content: string;
}

export default function Page() {
    const router = useRouter();
    const [postData, setPostData] = useState<Thread>({
        title: "Title",
        tags: ["C++", "Python"],
        sections: [
            {
                id: "section1",
                type: "p",
                content: "awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo awduno wdna owundawond awond owd oawd aowndauwdnawo ",
            }
        ],
    });
    const [showTagModel, setShowTagModel] = useState(false);
    const [showAddSectionModel, setShowAddSectionModel] = useState(false);

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

    const  handleAddSection = (data: Section) => {
        setPostData(prev=>({
            ...prev,
            sections: [...prev.sections, data],
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

    const toggleAddSectionModel = (e: any) => {
        e?.preventDefault();
        setShowAddSectionModel(!showAddSectionModel);
    }

    const editSectionContent = (e: any) => {
        e?.preventDefault();
        const id = e.target.name;
        console.log(e.target.value);

        const newSections = postData.sections.map(section =>{
            if(section.id === id){
                return {...section, content: e.target.value}
            }
            return section;
        });

        setPostData(prev=>({
           ...prev,
            sections: newSections,
        }))
    }

    const sectionMapper = (data: Section) => {
        return (
            <EditableTag key={data.id} htmlTag={data.type} inputType="text" name={data.id} value={data.content} func={editSectionContent}/>
        )
    }

    const submit = async (e: any) => {
        e?.preventDefault();
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData),
        })

        // TODO: handle res and redirect
        if (res.ok) router.push(`/`);
    }

    return (
        <main className="flex pl-2 w-[1280px] py-4">
            <form className="flex w-full flex-col" onSubmit={submit}>
                {/* Title section */}
                <EditableTag name="title" htmlTag={"h1"} inputType="text" value={postData?.title || ""} func={handleInput} />
                {/* TAG section */}
                <div className="flex items-center justify-between flex-col gap-1 w-full my-2 relative md:flex-row">
                    <div className="flex flex-wrap w-full gap-2 md:w-auto">
                        {postData.tags.length > 0 && postData.tags.map(tagsMapper)}
                    </div>


                    <div className="flex items-center">
                        <button onClick={ToggleTagModel} className="flex p-[2px] relative">
                            <div className="absolute z-0 inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                            <div className={`${showTagModel && "bg-transparent"} px-8 py-1 mt-0 bg-black rounded-[6px]  relative group transition duration-200 text-white`}>
                                {showTagModel ? <IconX />:<IconPlus />}
                            </div>
                        </button>
                    </div>

                    <TagModel showTagModel={showTagModel} func={ToggleTagModel} addTag={handleAddTag}/>
                </div>

                { postData.sections.length > 0 && postData.sections.map(sectionMapper) }
                
                <AddSectionModel showAddSectionModel={showAddSectionModel} toggleFunc={toggleAddSectionModel} addSection={handleAddSection} />
                {/* Add section */}
                <div className="flex flex-col items-center justify-center gap-1 md:flex-row">
                    <button onClick={toggleAddSectionModel} className="p-[3px] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            Add Section
                        </div>
                    </button>
                    <button  className="p-[3px] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            Submit Post
                        </div>
                    </button>
                </div>
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

// Add section Model
const AddSectionModel = ({showAddSectionModel, toggleFunc, addSection}:{showAddSectionModel:boolean, toggleFunc: (e:any) => void, addSection:(data:Section) => void }) => {
    const options: HtmlTag[] = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "code"];
    const selectionRef = useRef<HTMLSelectElement>(null);

    // const crateSectionModel
    const createSection = (e: any) => {
        e?.preventDefault();
        if (selectionRef.current) {
            const selectedOption = selectionRef.current.value;
            const section: Section = {
                id: `${Math.random() *999}`,
                type: selectedOption as HtmlTag,
                content: `${selectedOption} section selected`,
            };
            addSection(section);
        }
        toggleFunc(null);
    };


    return (
        <div className={`${showAddSectionModel ? "absolute": "hidden"} z-20 top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 w-[225px] p-[3px]`}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="flex flex-col gap-2 p-2 px-4 pb-4 bg-black rounded-[6px] relative group transition duration-200 text-white">
                <h2 className="text-2xl">Create Section</h2>
                <select ref={selectionRef} className="flex flex-grow text-black rounded">
                    {
                        options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))
                    }
                </select>
                <button onClick={createSection} className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded">Add Section</button>
                <button onClick={toggleFunc} className="absolute right-2"><IconX /></button>
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    const editeTag = () => {
        setIsEditable(true);
    }

    useEffect(() => {
        if (isEditable) {
            inputRef.current?.focus();

            const saveListner = (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                    setIsEditable(false);
                    if (inputRef.current) {
                        inputRef.current?.blur();
                        document.body.focus();
                        inputRef.current?.removeEventListener("keypress", saveListner);
                    }else if (textareaRef.current) {
                        textareaRef.current?.blur();
                        document.body.focus();
                        textareaRef.current?.removeEventListener("keypress", saveListner);
                    }
                }
            }

            if (inputRef.current) {
                inputRef.current?.addEventListener("keypress", saveListner)
            }else if (textareaRef.current) {
                textareaRef.current?.addEventListener("keypress", saveListner)
            }
        }
    }, [isEditable]);

    return (
        <div className="w-full text-3xl my-0.5">
            {
                isEditable ?
                    <>
                        {htmlTag == "p" as HtmlTag && (<textarea ref={textareaRef} className="flex items-center justify-between w-full text-base p-1" name={name} value={value} onChange={func} />) }
                        {htmlTag !== "p" as HtmlTag && (<input ref={inputRef} className="flex items-center justify-between w-full" type={inputType} name={name} value={value} onChange={func} />)}
                        
                    </>
                :
                    <div className="flex items-start justify-between w-full" onClick={editeTag}>
                        {/* Switch block */}
                        {htmlTag == "h1" && <h1 className="text-4xl">{value}</h1>}
                        {htmlTag == "h2" && <h2 className="text-3xl">{value}</h2>}
                        {htmlTag == "h3" && <h3 className="text-2xl">{value}</h3>}
                        {htmlTag == "h4" && <h4 className="text-xl">{value}</h4>}
                        {htmlTag == "h5" && <h5 className="text-lg">{value}</h5>}
                        {htmlTag == "h6" && <h6 className="text-base">{value}</h6>}
                        {htmlTag == "p" && <p className="text-base">{value}</p>}
                        <span className=""><IconEdit /></span>
                    </div>
            }
        </div>
    )
}