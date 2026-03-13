import youtubeUrl from "youtube-url";

export async function getYoutubeVideoDetails(
  videoId: string
): Promise<{
  title: string;
  videoId: string;
  duration: number;
  thumbnailUrlHQ: string;
  thumbnailUrlLQ: string;
}> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (!response.ok) {
      throw new Error("Failed to fetch video details");
    }
    const videoDetails = await response.json();

    return {
      title: videoDetails.title,
      videoId,
      duration: 0,
      thumbnailUrlHQ: videoDetails.thumbnail_url || "",
      thumbnailUrlLQ: videoDetails.thumbnail_url || ""
    };
  } catch (error) {
    throw new Error("Error fetching YouTube video info");
  }
}

export function isYoutubeUrlValid(url: string): boolean {
  return youtubeUrl.valid(url);
}

export function getYoutubeVideoId(url: string): string {
  if (!youtubeUrl.valid(url)) {
    throw new Error("Invalid YouTube URL");
  }
  const videoId = youtubeUrl.extractId(url);
  if (videoId === null) {
    throw new Error("Could not extract video ID from URL");
  }
  return videoId;
}
