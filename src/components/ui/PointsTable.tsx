"use client";

import { PointsTable as PointsTableType } from "@/types";
import PointsTableHeader from "@/components/points/PointsTableHeader";
import PointsTableRow from "@/components/points/PointsTableRow";
import { APP_TEXT } from "@/constants/text";

interface PointsTableProps {
  data: PointsTableType;
  className?: string;
}

export default function PointsTableComponent({
  data,
  className = "",
}: PointsTableProps) {
  return (
    <div
      className={`bg-card rounded-xl shadow-lg overflow-hidden border border-border ${className}`}
    >
      <PointsTableHeader data={data} />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20 border-b-2 border-border">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.position}
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.team}
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.played}
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.won}
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.lost}
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.nrr}
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.for}
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.against}
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.points}
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {APP_TEXT.pointsTable.columns.recentForm}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.rows.map((team, index) => (
              <PointsTableRow
                key={team.team}
                team={team}
                index={index}
                totalTeams={data.rows.length}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
