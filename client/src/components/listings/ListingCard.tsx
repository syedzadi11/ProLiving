import Image from "next/image";
import Link from "next/link";
import { MapPin, ImageOff } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { Listing } from "@/types/listing";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
      <div className="relative h-[190px] bg-gray-100 shrink-0">
        {listing.image_url ? (
          <Image
            src={getImageUrl(listing.image_url) ?? ""}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageOff className="w-7 h-7" />
          </div>
        )}
        <span className="absolute top-[14px] left-[12px] bg-white px-2 py-0.5 rounded-[6px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-[11px] font-semibold tracking-wide text-[#131b2e]">
          {listing.room_type}
        </span>
      </div>

      <div className="p-5 pb-0">
        <h2 className="text-[16px] font-semibold text-[#131b2e] leading-6 mb-1 break-words">
          {listing.title}
        </h2>
        <p className="flex items-center gap-1 text-[13px] text-[#515f74]">
          <MapPin className="w-3 h-3 shrink-0" />
          {listing.city}, {listing.area}
        </p>
      </div>

      <div className="mt-4 bg-[#F2F3FF66] px-5 py-4 flex items-center justify-between">
        <span>
          <span className="text-[16px] font-bold text-[#131b2e]">
            Rs {listing.monthly_rent.toLocaleString()}
          </span>
          <span className="text-[13px] text-[#515f74]"> / month</span>
        </span>
        <Link href={`/listings/${listing.listing_id}`}>
          <button className="bg-[#dae2fd] hover:bg-[#c9d4fb] text-[#131b2e] text-[13px] font-medium px-4 py-2 rounded-[4px] transition-colors">
            View Space
          </button>
        </Link>
      </div>
    </div>
  );
}