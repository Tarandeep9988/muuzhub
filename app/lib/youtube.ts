import youtubeUrl from "youtube-url";
import { GetVideoDetails, VideoDetails } from "youtube-search-api";

function getVideoThumbnails(thumbnail: any) {
  const thumbnails = [...thumbnail.thumbnails];
  // sorting thumbnails by width * height in descending order
  thumbnails.sort((a: any, b: any) => b.width - a.width);
  const thumbnailUrlHQ = thumbnails[0].url;
  const thumbnailUrlLQ = thumbnails[1]?.url || thumbnailUrlHQ;
  return { thumbnailUrlHQ, thumbnailUrlLQ };
}

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
    const videoDetails = await GetVideoDetails(videoId);
    const { thumbnailUrlHQ, thumbnailUrlLQ } = getVideoThumbnails(
      videoDetails.thumbnail
    );

    return {
      title: videoDetails.title,
      videoId,
      duration: 0,
      thumbnailUrlHQ,
      thumbnailUrlLQ
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
