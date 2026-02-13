export interface Location {
  name: string;
  url: string;
}

export interface CharDTO {
  id: number;
  name: string;
  status: "Dead" | "Alive" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ResponseDTO {
  info: {
    count: number;
    pages: number;
    prev: number | null;
    next: string | null;
  }
  results: CharDTO[];
}
