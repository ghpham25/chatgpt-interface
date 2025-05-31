"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DescriptionCard({ description }) {
  const [image, setImage] = useState(null);
  const [chatSession, setChatSession] = useState(null);
  const imageId = description.image_id;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/images/${imageId}`);

        if (!response.ok) {
          console.error("Failed to fetch image.");
          return;
        }

        const data = await response.json();
        console.log("Image data:", data);
        setImage(data);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    const fetchChatSession = async () => {
      try {
        const response = await fetch(
          `/api/chats/${description.chat_session_id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch chat session.");
          return;
        }

        const data = await response.json();
        setChatSession(data);
      } catch (error) {
        console.error("Error fetching chat session:", error);
      }
    };

    fetchImage();
    fetchChatSession();
  }, [description]);

  console.log(image);
  console.log(chatSession);

  return (
    // <></>
    <Card className="max-w-xs w-full shadow-lg rounded-lg border border-gray-300">
      {/* Image */}
      <img
        src={image?.image_path}
        className="w-full h-48 object-cover rounded-t-lg"
      />

      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold">
          {chatSession?.title}
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          {description?.text}
        </CardDescription>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          href={"/saved_description/" + description?._id}
          asChild
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
