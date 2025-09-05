import { Box, Typography, Dialog } from "@mui/material";
import TranscriptPanel from "@/components/imageGalllery/TransciptPanel";
import { fps } from "@/constants/fps";
function getFpsForVideo(video_id: string): number | null {
  if (fps[`${video_id}.mp4`] !== undefined) return fps[`${video_id}.mp4`];
  if (fps[video_id] !== undefined) return fps[video_id];
  return null;
}


interface CheckVideoProps {
  openImage: { img: string; title: string } | null;
  setOpenImage: (val: { img: string; title: string } | null) => void;
  groupImages: string[];
  currentTimestamp: number | null;
  setCurrentTimestamp: (val: number) => void;
}

export default function CheckVideo({
  openImage,
  setOpenImage,
  groupImages,
  currentTimestamp,
  setCurrentTimestamp,
}: CheckVideoProps) {
  const getTimestampFromFilename = (filename: string): string => {
    const match = filename.match(/_(\d+\.\d+)s\.jpg$/);
    return match ? match[1] : "0.00";
  };

  const getFirstPart = (filename: string): string => {
    return filename.split("_")[0] || "";
  };

  const getFirstTwoParts = (filename: string): string => {
    const parts = filename.split("_");
    return parts.length >= 2 ? `${parts[0]}_${parts[1]}` : filename;
  };

  return (
    <Dialog
      open={!!openImage}
      onClose={() => setOpenImage(null)}
      maxWidth="lg"
      PaperProps={{
        sx: {
          height: "100vh",
          maxHeight: "100vh",
          margin: 0,
          borderRadius: 0,
        },
      }}
      slotProps={{ transition: { timeout: 0 } }}
      slots={{ transition: undefined }}
    >
      {openImage && (
        <Box className="flex w-full h-full gap-2 p-2 overflow-hidden">
          {/* Transcript bên trái */}
          <Box
            className="h-full overflow-y-auto border border-solid border-gray-300 rounded p-2"
            sx={{
              width: "30%",
              minWidth: 280,
              fontFamily: "monospace",
              fontSize: 14,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.6,
            }}
          >
            <TranscriptPanel
              videoId={getFirstTwoParts(openImage.title)}
              folder={getFirstPart(openImage.title)}
              currentTimestamp={currentTimestamp}
            />
          </Box>

          {/* Ảnh và danh sách bên phải */}
          <Box className="flex-1 h-full overflow-auto p-2">
            <img
              src={openImage.img}
              alt={openImage.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 8,
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
            <Typography sx={{ mt: 1, textAlign: "center", fontFamily: "monospace" }}>
              {openImage.title}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                fontFamily: "monospace",
                color: "#888",
                mt: 2,
                mb: 1,
                textAlign: "center",
              }}
            >
              Tổng số keyframe: {groupImages.length}{" "}
              {(() => {
                const fpsVal = getFpsForVideo(getFirstTwoParts(openImage.title));
                return fpsVal ? `(FPS: ${fpsVal})` : "";
              })()}
            </Typography>


            <Box sx={{ display: "flex", gap: 1, overflowX: "auto", mt: 2 }}>
              {groupImages.map((src) => {
                const filename = src.split("/").pop() || "";
                return (
                  <div
                    key={src}
                    style={{ flex: "0 0 auto" }}
                    className="flex flex-col items-center"
                  >
                    <img
                      src={src}
                      alt={filename}
                      style={{
                        height: 80,
                        width: "auto",
                        display: "block",
                        borderRadius: 6,
                        cursor: "pointer",
                        border:
                          openImage.img === src
                            ? "5px solid yellow"
                            : "1px solid #ccc",
                      }}
                      onClick={() => {
                        setOpenImage({ img: src, title: filename });
                        const timestamp = parseFloat(getTimestampFromFilename(filename));
                        setCurrentTimestamp(timestamp);
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontFamily: "monospace",
                        color: "#666",
                        mt: 0.5,
                      }}
                    >
                      {getTimestampFromFilename(src)}
                    </Typography>
                  </div>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
