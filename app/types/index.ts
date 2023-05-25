import { Listing, User } from "@prisma/client";

export type safeListings = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafeReservation = Omit<
  User,
  "createAt" | "startDate" | "endDate" | "listing"
> & {
  createAt: string;
  startDate: string;
  endDate: string;
  listing: safeListings;
};

export type SafeUser = Omit<User, "createAt" | "updateAt" | "emailVerified"> & {
  createAt: string;
  updateAt: string;
  emailVerified: string | null;
};
