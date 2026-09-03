import { Listing } from "./listing";

export type RequestStatus = "Pending" | "Accepted" | "Rejected";

export interface ConnectionRequest {
  connection_id: number;
  listing_id: number;
  user_id: number;
  message: string;
  status: RequestStatus;
  created_at: string;
  Listing?: Listing & {
    User?: { user_id: number; full_name: string; phone?: string };
  };
  ownerPhone?: string;
}