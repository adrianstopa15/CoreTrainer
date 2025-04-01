export interface ISelectedExercise {
  _id: string;
  name: string;
  bodySection: string;
  bodyPart: string;
  img: string | null;
  series: {
    kg: number | string;
    reps: number | string;
  }[];
}

export interface Exercise {
  _id: string;
  name: string;
  bodySection: string;
  bodyPart: string;
  img: string;
}

export const muscleGroupMap: Record<string, "góra" | "dół"> = {
  Barki: "góra",
  Biceps: "góra",
  Triceps: "góra",
  Brzuch: "góra",
  "Czworoboczny uda": "dół",
  "Czworogłowy uda": "dół",
  Grzbiet: "góra",
  "Klatka piersiowa": "góra",
  Łydki: "dół",
  Plecy: "góra",
  Pośladkowy: "dół",
  "Prostownik grzbietu": "góra",
  Przedramię: "góra",
};
