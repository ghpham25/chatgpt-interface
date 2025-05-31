//Description Page, which will be mapped to cards
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DescriptionCard from "@/page_components/description_card";

export default function SavedDescription() {
  const [descriptions, setDescriptions] = useState([]);
  useEffect(() => {
    const fetchDescription = async () => {
      const user_id = "demo-user";
      const response = await fetch(`/api/saved?user_id=${user_id}`);
      const data = await response.json();
      setDescriptions(data);
    };
    fetchDescription();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {descriptions.map((desc) => (
        <Link href={`/saved_description/${desc._id}`} key={desc._id}>
          <DescriptionCard description={desc} />{" "}
          {/* Pass description data to Card */}
        </Link>
      ))}
    </div>
  );
}
