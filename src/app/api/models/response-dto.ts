export interface CharDTO {
  id: number;
  name: string;
  status: "Dead" | "Alive";
  species: string;
  image: string;

}

export interface ResponseDTO {
  info: {
    count: number;
    pages: number;
    prev: number | null
  }
  results: CharDTO[]
}
