import { APP_TEXT } from "@/constants/text";
import { PointsTableHeaderProps } from "@/types";

export default function PointsTableHeader({ data }: PointsTableHeaderProps) {
  // Format date consistently to avoid hydration issues
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month}, ${hours}:${minutes}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">{data.season}</h2>
          <p className="text-purple-100 text-sm">
            {APP_TEXT.pointsTable.header.title}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-90">
            {APP_TEXT.pointsTable.header.updated} {formatDate(data.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
