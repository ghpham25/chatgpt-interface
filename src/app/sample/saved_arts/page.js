import DescriptionCard from "@/page_components/description_card";

export default function SavedArts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Card 1 */}
      <DescriptionCard />
      {/* More cards can be added here */}
      <DescriptionCard />
      <DescriptionCard />
      <DescriptionCard />

    </div>
  );
}
