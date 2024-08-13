"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/ui/Sidebar";
import { IconBook, IconBookmarksFilled, IconSquarePlus, IconDeviceFloppy, IconDoorExit, IconDoorEnter, IconUserCircle } from "@tabler/icons-react";
import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-[--fg-color] py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-[--bg-color] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-[--fg-color] whitespace-pre"
      >
        Thoughtfull Threads
      </motion.span>
    </Link>
  );
};

const UserLink = ({href, label, icon}: {href: string, label: string, icon: string}) => {
  const profilePic  = icon === "undefined" ? <IconUserCircle />: <Image src={icon} className="h-7 w-7 flex-shrink-0 rounded-full" width={50} height={50} alt="Avatar"/>

  return (
    <SidebarLink link={{
      href, 
      label, 
      icon: profilePic
    }} />
  )
}

export default function NavBar() {
    const links = [
      {
        label: "Feed",
        href: "#",
        icon: (<IconBook />),
      },
      {
        label: "Create Post",
        href: "/create",
        icon: (<IconSquarePlus />),
      },
      {
        label: "About",
        href: "#",
        icon: (<IconDeviceFloppy />),
      },
      {
        label: "Bookmark",
        href: "#",
        icon: (<IconBookmarksFilled />),
      },
    ];
    const session = useSession();

    
    const [open, setOpen] = useState(false);

    const logout = () => {
      signOut()
    }

    const login = () => {
      signIn();
    }    

    return (
        <div className="pr-[57px] md:pr-[60px]">
          <nav className="fixed z-50 md:h-full">
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <Logo />
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx)=>(
                                <SidebarLink key={idx} link={link} />
                            ))}

                            {
                              session.status === "authenticated"?
                                <button onClick={logout}>
                                  <SidebarLink link={{href:"#", icon: (<IconDoorExit />), label: "log out"}} />
                                </button>
                              :
                                <button onClick={login}>
                                  <SidebarLink link={{href:"#", icon: (<IconDoorExit />), label: "log in"}} />
                                </button>
                              }
                        </div>
                    </div>
                    <div>
                      {session.status == "authenticated" && <UserLink href={session.data.user?.name || "Profile"} label="Profile" icon={session.data.user?.image || ""} />}
                    </div>
                </SidebarBody>
            </Sidebar>
          </nav>
        </div>
    );
  }