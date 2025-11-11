export const convertToEmbedURL = (url: string) => {
  const videoIdMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/(?:\S+\/)+))([a-zA-Z0-9_-]{11})/,
  );
  return videoIdMatch
    ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
    : null;
};
