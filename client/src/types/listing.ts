export type RoomType = "Single Room" | "Shared Room" | "Full Apartment";
export type ListingStatus = "Active" | "Rented" | "Expired";

export interface Listing {
  listing_id: number;
  title: string;
  description: string;
  city: string;
  area: string;
  room_type: RoomType;
  monthly_rent: number;
  status: ListingStatus;
  user_id: number;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  User?: { user_id: number; full_name: string };
}

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
}