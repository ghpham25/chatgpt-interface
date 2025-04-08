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

export default function DescriptionCard() {
  return (
    <Card className="max-w-xs w-full shadow-lg rounded-lg border border-gray-300">
      {/* Image */}
      <img
        src="/mona_lisa.jpg"
        className="w-full h-48 object-cover rounded-t-lg"
        alt="Mona Lisa"
      />

      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold">Mona Lisa</CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          One of the most famous paintings by Leonardo da Vinci, known for its
          enigmatic smile.
        </CardDescription>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          href="/sample/mona-lisa"
          asChild
        >
          <Link>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
