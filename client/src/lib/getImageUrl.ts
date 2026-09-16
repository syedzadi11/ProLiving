const API_URL = process.env.NEXT_PUBLIC_API_URL || "";


export const ASSET_BASE_URL = API_URL.replace(/\/api\/?$/, "");

export function getImageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${ASSET_BASE_URL}${path}`;
}