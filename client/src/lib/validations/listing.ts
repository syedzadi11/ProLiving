import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),
  room_type: z.enum(["Single Room", "Shared Room", "Full Apartment"], {
    message: "Please select a room type",
  }),
  monthly_rent: z.coerce.number().min(1, "Monthly rent must be greater than 0"),
});

export type ListingFormData = z.infer<typeof listingSchema>;