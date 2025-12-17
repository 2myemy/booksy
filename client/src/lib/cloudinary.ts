export function cloudThumb(url: string | null | undefined, w = 320, h = 420) {
  if (!url) return null;
  // Cloudinary URL이 아닐 경우 그대로 반환
  if (!url.includes("/upload/")) return url;

  // 썸네일: fill + auto format + auto quality
  // 예: .../upload/c_fill,w_320,h_420,f_auto,q_auto/....
  return url.replace(
    "/upload/",
    `/upload/c_fill,w_${w},h_${h},f_auto,q_auto/`
  );
}
