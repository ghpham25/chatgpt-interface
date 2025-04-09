"use client";

// You can directly use useState for form values instead of react-hook-form

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SampleHome() {
  const [formData, setFormData] = useState({
    title: "",
    picture: undefined,
    initprompt: "",
  });
  const router = useRouter();

  const prompts = [
    {
      value:
        "Give me a description of this image assuming I could not see it for myself. Focus specifically on the spatial information in the image, first with a general overview and then describe the objects in the image from foreground to the background and left to right.",
      label:
        "Give me a description of this image assuming I could not see it for myself. Focus specifically on the spatial information in the image, first with a general overview and then describe the objects in the image from foreground to the background and left to right.",
    },
    {
      value:
        "I am a blind museum visitor. I would like to understand what a painting in the museum is about but I need a description that highlights the spatial information in the image before the cultural or artistic significance. I would like you to provide a description for this uploaded image.",
      label:
        "I am a blind museum visitor. I would like to understand what a painting in the museum is about but I need a description that highlights the spatial information in the image before the cultural or artistic significance. I would like you to provide a description for this uploaded image.",
    },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });
    }
  };

  const handleChange = (value) => {
    setFormData({ ...formData, initprompt: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    //Upload the image to database
    const imageForm = new FormData();
    imageForm.append("image", formData.picture);
    imageForm.append("user_id", "demo-user"); // optional for now

    const imageRes = await fetch("/api/images/", {
      method: "POST",
      body: imageForm,
    });
    if (!imageRes.ok) {
      console.error("Image upload failed.");
      return;
    }

    const imageData = await imageRes.json();
    const imageId = imageData.image_id;

    //Create a new chat session
    const chatRes = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ ensures req.body is parsed as JSON
      },

      body: JSON.stringify({
        title: formData.title,
        image_id: imageId,
        initial_prompt: formData.initprompt,
        user_id: "demo-user", // optional for now
      }),
    });

    if (!chatRes.ok) {
      console.log(chatRes);
      return;
    }
    const chatData = await chatRes.json();
    const chatId = chatData.chat_id;

    // // 3. Redirect to new chat page
    // router.push(`/chat/${chat_id}`);

    // const objectURL = URL.createObjectURL(formData.picture);
    // router.push(
    //   `/sample/home/onethread?image=${encodeURIComponent(
    //     objectURL
    //   )}&title=${encodeURIComponent(
    //     formData.title
    //   )}&initprompt=${encodeURIComponent(formData.initprompt)}`
    // );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-lg font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g: Mona Lisa"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col">
          <label
            htmlFor="picture"
            className="text-lg font-medium text-gray-700 mb-2"
          >
            Picture
          </label>
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handleImageUpload}
            accept="image/*"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Custom Dropdown for Prompt */}
        <div className="relative">
          <label
            htmlFor="initprompt"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Select a prompt
          </label>
          <div className="mt-1">
            <div className="border border-gray-300 rounded-md">
              {prompts.map((prompt) => (
                <div
                  key={prompt.value}
                  className={`p-3 cursor-pointer hover:bg-gray-100 ${
                    formData.initprompt === prompt.value ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleChange(prompt.value)}
                >
                  {prompt.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Start a thread
          </button>
        </div>
      </form>
    </div>
  );
}
