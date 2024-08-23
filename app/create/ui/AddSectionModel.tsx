"use client"
import { ChangeEvent, useState } from "react";

import { Section } from "../page";
import { HtmlTag } from "./EditableTag";
import { IconX } from "@tabler/icons-react";

export default function AddSectionModel({showAddSectionModel, allowImages, toggleFunc, addSection}:{showAddSectionModel:boolean, allowImages: boolean, toggleFunc: (e:any) => void, addSection:(data:Section) => void }){
    const options: HtmlTag[] = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "code", "image"];
    const [selectedOption, setSelectedOption] = useState<string>('h1');
    const [language, setLanguage] = useState<string>("");

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    // const crateSectionModel
    const createSection = (e: any) => {
        e?.preventDefault();
        
        const section: Section = {
            id: `${Math.random() *999}`,
            type: selectedOption as HtmlTag,
            content: `${selectedOption} section selected`,
        };

        addSection(section);
        
        toggleFunc(null);
    };

    return (
        <div className={`${showAddSectionModel ? "absolute": "hidden"} z-20 top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 w-[225px] p-[3px]`}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="flex flex-col gap-2 p-2 px-4 pb-4 bg-black rounded-[6px] relative group transition duration-200 text-white">
                <h2 className="text-2xl">Create Section</h2>

                <select value={selectedOption} onChange={handleChange} className="flex flex-grow text-black rounded">{
                    options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    )).filter(option=>{
                        if (!allowImages && option.props.value == "image") {
                            return false;
                        }
                        return true
                    })
                }</select>

                {selectedOption == "code" && (
                    <input onChange={(e: ChangeEvent<HTMLInputElement>)=>setLanguage(e.target.value)} value={language} className="text-[--fg-color] rounded" type="text" />
                ) }

                <button onClick={createSection} className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded">Add Section</button>
                <button onClick={toggleFunc} className="absolute right-2"><IconX /></button>
            </div>
        </div>
    )
}