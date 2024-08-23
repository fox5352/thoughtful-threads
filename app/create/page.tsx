"use client";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import EditableTag, { HtmlTag, InputType } from "./ui/EditableTag";
import AddSectionModel from "./ui/AddSectionModel";
import TagModel from "./ui/TabModel";

export interface Thread {
    title: string;
    tags: string[];
    sections: Section[];
}

export interface Section {
    id: string;
    order_num: number;
    type: HtmlTag;
    content: string;
}

export default function Page() {
    const router = useRouter();
    const counterRef = useRef(0);
    const [postData, setPostData] = useState<Thread>({
        title: "Title",
        tags: [],
        sections: [],
    });
    const [showTagModel, setShowTagModel] = useState(false);
    const [showAddSectionModel, setShowAddSectionModel] = useState(false);

    const [isImageCapped, setIsImageCapped] = useState(false);
    const [isSectionsCapped, setIsSectionsCapped] = useState(false)
    const [isTagsCapped, setIsTagsCapped] = useState(false);


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

    const editSectionContent = async (e: any) => {
        e?.preventDefault();
        const id = e.target.name;

        const newSections = await Promise.all(postData.sections.map(async section =>{
            if(section.id === id){
                if (section.type == "image") {
                    try {
                        const dataUrl = await getImageBlob(e);
    
                        return {
                            ...section,
                            content: dataUrl
                        }                    
                    } catch (error) {
                        console.error("Error getting image data:", error);
                        return section;
                    }
                }else {
                    return {
                        ...section,
                        content: e.target.value
                    }
                }
            }
            return section;
        }));
                
        setPostData(prev=>({
           ...prev,
            sections: newSections,
        }))
    }

    const RemoveEditableSection = (id: any) => {
        const newData = postData.sections.filter(sec=> sec.id != id);
        setPostData(prev=>({
            ...prev,
            sections: newData
        }))
    }

    const sectionMapper = (data: Section) => {
                
        return (
            <EditableTag key={data.id} id={data.id} htmlTag={data.type} inputType={data.type == "image"? "file": "text"} name={data.id} value={data.content} handleInput={editSectionContent} removeSection={RemoveEditableSection} />
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

        
        
        if (res.ok) {
            const data = await res.json();
            router.push(`/posts/${data.id}`);
        }
    }

    const getImageBlob = (e: React.ChangeEvent<HTMLInputElement>) => {
        return new Promise<string>((resolve, reject) => {
          const file = e.target.files && e.target.files[0];
      
          if (!file) {
            reject("No file selected");
            return;
          }
      
          if (!file.type.startsWith('image/')) {
            reject("Selected file is not an image");
            return;
          }
      
          const fileReader = new FileReader();
      
          fileReader.onload = function () {
            if (fileReader.result && typeof fileReader.result === 'string') {
              resolve(fileReader.result);
            } else {
              reject("FileReader did not return a string");
            }
          };
      
          fileReader.onerror = function () {
            reject(`FileReader error: ${fileReader.error}`);
          };
      
          fileReader.onabort = function () {
            reject("File reading was aborted");
          };
      
          try {
            fileReader.readAsDataURL(file);
          } catch (error) {
            reject(`Error starting file read: ${error}`);
          }
        });
    };

    useEffect(()=>{
        const imageCap = 5;
        const sectionsCap = 12
        const tagCap = 10;

        let imageCounter = 0;
        let sectionsCounter = 0;
        let tagCounter = 0;


        postData.sections.forEach(data=>{
            counterRef.current += 1;

            switch (data.type) {
                case "image":
                    console.log("image");
                    
                    imageCounter++;
                    break;
                default:
                    sectionsCounter++;
                    break;
            }
        });
        postData.tags.forEach(data=>{
            tagCounter++
        });

        imageCounter >= imageCap ? setIsImageCapped(true): setIsImageCapped(false);

        sectionsCounter >= sectionsCap ? setIsSectionsCapped(true): setIsSectionsCapped(false);

        tagCounter >= tagCap ?setIsTagsCapped(true): setIsTagsCapped(false);
        
        console.log("sections counter:", counterRef);
        
    },[postData.tags, postData.sections])

    return (
        <main className="flex pl-2 w-[1280px] py-4">
            <form className="flex w-full flex-col" onSubmit={submit}>
                {/* Title section */}
                <EditableTag id={"title"} name="title" htmlTag={"h1"} inputType="text" value={postData?.title || ""} handleInput={handleInput} removeSection={RemoveEditableSection}/>
                {/* TAG section */}
                <div className="flex items-center justify-between flex-col gap-1 w-full my-2 relative md:flex-row">
                    <div className="flex flex-wrap w-full gap-2 md:w-auto">
                        {postData.tags.length > 0 && postData.tags.map(tagsMapper)}
                    </div>


                    <div className="flex items-center">
                        <button disabled={isTagsCapped} onClick={ToggleTagModel} className="flex p-[2px] relative">
                            <div className={`absolute inset-0 bg-gradient-to-r  ${isTagsCapped ? "from-rose-400 to-[crimson]": "from-indigo-500 to-purple-500"} rounded-lg`} />
                            <div className={`${showTagModel && "bg-transparent"} px-8 py-1 mt-0 bg-black rounded-[6px]  relative group transition duration-200 text-white`}>
                                {showTagModel ? <IconX />:<IconPlus />}
                            </div>
                        </button>
                    </div>

                    <TagModel showTagModel={showTagModel} func={ToggleTagModel} addTag={handleAddTag}/>
                </div>

                { postData.sections.length > 0 && postData.sections.map(sectionMapper) }
                
                <AddSectionModel showAddSectionModel={showAddSectionModel} counter={counterRef.current} isImagesAllowed={!isImageCapped} toggleFunc={toggleAddSectionModel} addSection={handleAddSection} />
                {/* Add section */}
                <div className="flex flex-col items-center justify-center gap-1 mt-4 md:flex-row">
                    <button disabled={isSectionsCapped} onClick={toggleAddSectionModel} className="p-[3px] relative">
                        <div className={`absolute inset-0 bg-gradient-to-r  ${isSectionsCapped ? "from-rose-400 to-[crimson]": "from-indigo-500 to-purple-500"} rounded-lg`} />
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