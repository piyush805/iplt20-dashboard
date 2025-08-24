// src/utils/teams.ts
import { TeamId } from "@/server/types";

export interface TeamConfig {
  id: TeamId;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  city: string;
  founded: number;
  logo: string;
}

export const TEAM_CONFIGS: Record<TeamId, TeamConfig> = {
  CSK: {
    id: "CSK",
    name: "Chennai Super Kings",
    shortName: "Super Kings",
    primaryColor: "#FFD700",
    secondaryColor: "#1E40AF",
    city: "Chennai",
    founded: 2008,
    logo: "/CSK.png",
  },
  MI: {
    id: "MI",
    name: "Mumbai Indians",
    shortName: "Indians",
    primaryColor: "#004BA0",
    secondaryColor: "#FFD700",
    city: "Mumbai",
    founded: 2008,
    logo: "/MI.png",
  },
  RCB: {
    id: "RCB",
    name: "Royal Challengers Bangalore",
    shortName: "Challengers",
    primaryColor: "#EC1C24",
    secondaryColor: "#FFD700",
    city: "Bangalore",
    founded: 2008,
    logo: "/RCB.png",
  },
  KKR: {
    id: "KKR",
    name: "Kolkata Knight Riders",
    shortName: "Knight Riders",
    primaryColor: "#3A0CA3",
    secondaryColor: "#FFD700",
    city: "Kolkata",
    founded: 2008,
    logo: "/KKR.png",
  },
  SRH: {
    id: "SRH",
    name: "Sunrisers Hyderabad",
    shortName: "Sunrisers",
    primaryColor: "#FF8C00",
    secondaryColor: "#000000",
    city: "Hyderabad",
    founded: 2013,
    logo: "/SRH.png",
  },
  PBKS: {
    id: "PBKS",
    name: "Punjab Kings",
    shortName: "Kings",
    primaryColor: "#DC143C",
    secondaryColor: "#C0C0C0",
    city: "Punjab",
    founded: 2008,
    logo: "/PBK.png",
  },
  RR: {
    id: "RR",
    name: "Rajasthan Royals",
    shortName: "Royals",
    primaryColor: "#FF1493",
    secondaryColor: "#FFD700",
    city: "Jaipur",
    founded: 2008,
    logo: "/RR.png",
  },
  GT: {
    id: "GT",
    name: "Gujarat Titans",
    shortName: "Titans",
    primaryColor: "#1E3A8A",
    secondaryColor: "#FFD700",
    city: "Ahmedabad",
    founded: 2022,
    logo: "/GT.png",
  },
  DC: {
    id: "DC",
    name: "Delhi Capitals",
    shortName: "Capitals",
    primaryColor: "#17408B",
    secondaryColor: "#C41E3A",
    city: "Delhi",
    founded: 2008,
    logo: "/DC.png",
  },
  LSG: {
    id: "LSG",
    name: "Lucknow Super Giants",
    shortName: "Super Giants",
    primaryColor: "#00A7E1",
    secondaryColor: "#FFD700",
    city: "Lucknow",
    founded: 2022,
    logo: "/LSG.png",
  },
};

export function getTeamConfig(teamId: TeamId): TeamConfig | undefined {
  return TEAM_CONFIGS[teamId];
}

export function getTeamColor(
  teamId: TeamId,
  variant: "primary" | "secondary" = "primary"
): string {
  const config = getTeamConfig(teamId);
  if (!config) {
    // Return a default color if team config is not found
    return variant === "primary" ? "#6B7280" : "#9CA3AF";
  }
  return variant === "primary" ? config.primaryColor : config.secondaryColor;
}

// Helper function to get contrasting text color
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white based on brightness
  return brightness > 128 ? "#000000" : "#FFFFFF";
}
