"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SampleMonaLisa() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState(
    "Mona Lisa is a world-famous portrait painted by Leonardo da Vinci, admired for its enigmatic expression and masterful technique."
  );

  const handleEditDescription = () => {
    setIsModalOpen(true);
  };

  const handleSaveDescription = () => {
    setIsModalOpen(false);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Mona Lisa</h1>

      {/* Image & Description Section */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src="/mona_lisa.jpg"
          alt="Mona Lisa"
          className="max-w-sm w-full h-auto rounded-lg shadow-md"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg font-semibold mb-2">Description:</h2>
          <p className="text-gray-700">{description}</p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-end mt-6 gap-4">
        <Button onClick={handleEditDescription} variant="outline">
          Edit Description
        </Button>
        <Button>Continue to Prompt</Button>
      </div>

      {/* Edit Description Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Description</h2>
            <textarea
              value={description}
              onChange={handleChangeDescription}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
