"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming Button component is imported from UI

export default function SavedDescription() {
  const { descriptionId } = useParams();
  const [savedDescription, setSavedDescription] = useState(null);
  const [image, setImage] = useState(null);
  const [chatSession, setChatSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    if (!descriptionId) return;

    const fetchDescription = async () => {
      try {
        const response = await fetch(`/api/saved/${descriptionId}`);
        if (!response.ok) {
          console.error("Failed to fetch saved description.");
          return;
        }
        const data = await response.json();
        setSavedDescription(data);
        setEditedDescription(data.text); // Pre-populate the text for editing

        const imageRes = await fetch(`/api/images/${data.image_id}`);
        if (!imageRes.ok) throw new Error("Image fetch failed.");
        const imageData = await imageRes.json();
        setImage(imageData);

        const chatRes = await fetch(`/api/chats/${data.chat_session_id}`);
        if (!chatRes.ok) throw new Error("Chat fetch failed.");
        const chatData = await chatRes.json();
        setChatSession(chatData);
      } catch (error) {
        console.error("Error fetching saved description:", error);
      }
    };

    fetchDescription();
  }, [descriptionId]);

  const handleEditDescription = () => {
    setIsModalOpen(true);
  };

  const handleSaveDescription = () => {
    // Call API to save the updated description (you can implement this later)
    console.log("Saving edited description:", editedDescription);
    setIsModalOpen(false);
  };

  const handleChangeDescription = (e) => {
    setEditedDescription(e.target.value);
  };

  if (!savedDescription || !image || !chatSession) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">{chatSession.title}</h1>
      <p className="text-sm text-gray-500 mt-2">
        {savedDescription.created_at}
      </p>

      <div className="flex flex-col md:flex-row items-center mt-6 gap-8 p-4">
        <img
          src={image.image_path}
          alt="Description Image"
          className="w-full max-w-md h-64 object-cover rounded-md shadow-md"
        />

        <div className="flex-1 text-center md:text-left mt-6 md:mt-0">
          <h2 className="text-lg font-semibold mb-2">Description:</h2>
          <p className="text-gray-700">{savedDescription.text}</p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-end mt-6 gap-4 pr-1.5">
        <Button onClick={handleEditDescription} variant="outline">
          Edit Description
        </Button>
        <a
          href={`/chat/${chatSession._id}`}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
        >
          Go to Chat Session
        </a>
      </div>

      {/* Edit Description Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Description</h2>
            <textarea
              value={editedDescription}
              onChange={handleChangeDescription}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Edit the description..."
            />
            <div className="flex justify-end mt-4 gap-2">
              <Button onClick={handleSaveDescription}>Save</Button>
              <Button onClick={() => setIsModalOpen(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
