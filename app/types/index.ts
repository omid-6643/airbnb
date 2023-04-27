import { User } from "@prisma/client";

export type SafeUser = Omit<User, "createAt" | "updateAt" | "emaiVerified"> & {
  createAt: string;
  updateAt: string;
  emaiVerified: string | null;
};
