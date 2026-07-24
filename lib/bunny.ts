// Ported directly from app/page.js on the web app — same library, same hostname.
const BUNNY_CDN_HOSTNAME = "vz-b7971a5e-657.b-cdn.net";

function parseBunnyUrl(url: string | null) {
  if (!url) return null;

  const match = url.match(
    /player\.mediadelivery\.net\/(?:play|embed)\/(\d+)\/([a-f0-9-]+)/i
  );

  if (!match) return null;

  const [, libraryId, videoId] = match;
  return { libraryId, videoId };
}

export function getBunnyStreamUrl(url: string | null): string {
  const parsed = parseBunnyUrl(url);
  if (!parsed || !url) return url || "";

  return `https://${BUNNY_CDN_HOSTNAME}/${parsed.videoId}/playlist.m3u8`;
}

export function getBunnyThumbnail(url: string | null): string | null {
  const parsed = parseBunnyUrl(url);
  if (!parsed) return null;

  return `https://${BUNNY_CDN_HOSTNAME}/${parsed.videoId}/thumbnail.jpg`;
}

export function isYouTubeUrl(url: string | null): boolean {
  return Boolean(url?.includes("youtube.com") || url?.includes("youtu.be"));
}
