import { uuidv7 } from "uuidv7";

export function generateId<T extends string>():T{
  return uuidv7() as T  
}