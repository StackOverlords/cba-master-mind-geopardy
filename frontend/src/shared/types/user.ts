import type { UserRole } from "../auth.types";

export interface User {
  _id: string;
  firebaseUid: string
  name: string;
  email: string;
  role: UserRole
}