import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  city: z.string().min(2, "City is required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;