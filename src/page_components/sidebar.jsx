"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

export default function AppSideBar() {
  const user_id = "demo-user"; // Replace with actual user ID logic
  const [chatSessions, setChatSessions] = useState([]);

  useEffect(() => {
    console.log("fetching chat sessions for side bar");
    const fetchData = async () => {
      const response = await fetch(`/api/chats?user_id=${user_id}`, {
        method: "GET",
      });

      if (!response.ok) {
        console.error("Failed to fetch chat sessions.");
        return;
      }

      const data = await response.json();
      setChatSessions(data);
    };

    fetchData();
  }, []); // Empty dependency array ensures it only runs once when the component mounts

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/sample/home" asChild>
              <a className="font-bold"> Home </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton href="/sample/saved_arts" asChild>
              <a className="font-bold"> Saved Arts </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel> Ongoing </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {chatSessions
                .filter((chat) => chat.is_archived === false)
                .map((chat) => (
                  <SidebarMenuItem key={chat.chatId}>
                    <SidebarMenuButton href={`/chat/${chat.chatId}`} asChild>
                      <a>{chat.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel> Archived </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatSessions
                .filter((chat) => chat.is_archived === true)
                .map((chat) => (
                  <SidebarMenuItem key={chat.chatId}>
                    <SidebarMenuButton href={`/chat/${chat.chatId}`} asChild>
                      <a>{chat.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
