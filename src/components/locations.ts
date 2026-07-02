export interface Location {
  id: string;
  name: string;
  type: "country" | "county" | "constituency" | "ward" | "town" | "landmark";
  coordinates: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
  description: string;
  population?: string;
  area?: string;
  elevation?: string;
  image?: string;
  color: string;
}

export const locations: Location[] = [
  {
    id: "nairobi-cbd",
    name: "Nairobi CBD",
    type: "town",
    coordinates: [36.8219, -1.2921],
    zoom: 15,
    pitch: 60,
    bearing: 0,
    description: "The central business district of Nairobi, Kenya's capital and largest city.",
    population: "5.2M",
    area: "696 km²",
    elevation: "1,795 m",
    color: "#6366f1",
  },
  {
    id: "nairobi",
    name: "Nairobi County",
    type: "county",
    coordinates: [36.8172, -1.2864],
    zoom: 12,
    pitch: 45,
    bearing: -20,
    description: "Capital city of Kenya, known for its vibrant culture and economic significance.",
    population: "5.2M",
    area: "696 km²",
    elevation: "1,795 m",
    color: "#8b5cf6",
  },
  {
    id: "karen",
    name: "Karen",
    type: "ward",
    coordinates: [36.7333, -1.3167],
    zoom: 14,
    pitch: 50,
    bearing: 30,
    description: "A wealthy suburb of Nairobi named after Karen Blixen.",
    population: "120K",
    area: "42 km²",
    color: "#ec4899",
  },
  {
    id: "kicc",
    name: "KICC",
    type: "landmark",
    coordinates: [36.8215, -1.2883],
    zoom: 16,
    pitch: 65,
    bearing: 45,
    description: "Kenyatta International Convention Centre, iconic circular building in Nairobi.",
    population: undefined,
    area: undefined,
    elevation: undefined,
    color: "#f59e0b",
  },
  {
    id: "westlands",
    name: "Westlands",
    type: "ward",
    coordinates: [36.8128, -1.2672],
    zoom: 14,
    pitch: 55,
    bearing: -10,
    description: "A major commercial and nightlife hub in Nairobi.",
    population: "85K",
    area: "18 km²",
    color: "#06b6d4",
  },
];
