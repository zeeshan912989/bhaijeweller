/**
 * In-Browser Client-Side Video Compressor
 * Compresses large 4K/1080p mobile video reels down to web-optimized 720p HD (9:16)
 * with controlled bitrate (1.5 - 2.5 Mbps), reducing file size by 70% to 90%.
 */

export interface CompressionProgress {
  percent: number;
  originalSizeMb: number;
  compressedSizeMb?: number;
  savedPercentage?: number;
  status: "idle" | "loading" | "compressing" | "done" | "error";
  message?: string;
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  videoBitrate?: number; // bps, e.g. 2_000_000 for 2 Mbps
  fps?: number;
  onProgress?: (progress: CompressionProgress) => void;
}

/**
 * Compresses a video File in-browser using HTML5 Canvas and MediaRecorder.
 */
export async function compressVideo(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 720,
    maxHeight = 1280,
    videoBitrate = 1_800_000, // 1.8 Mbps (optimal for mobile reels)
    fps = 30,
    onProgress,
  } = options;

  const originalSizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));

  // If already under 2MB, no heavy compression needed
  if (file.size < 2 * 1024 * 1024) {
    onProgress?.({
      percent: 100,
      originalSizeMb,
      compressedSizeMb: originalSizeMb,
      savedPercentage: 0,
      status: "done",
      message: "File is already optimal size",
    });
    return file;
  }

  onProgress?.({
    percent: 5,
    originalSizeMb,
    status: "loading",
    message: "Initializing video compressor...",
  });

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      onProgress?.({
        percent: 0,
        originalSizeMb,
        status: "error",
        message: "Failed to load video file.",
      });
      // Fallback to original file
      resolve(file);
    };

    video.onloadedmetadata = () => {
      const duration = video.duration || 1;
      let targetWidth = video.videoWidth || 720;
      let targetHeight = video.videoHeight || 1280;

      // Scale dimensions maintaining aspect ratio
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const widthRatio = maxWidth / targetWidth;
        const heightRatio = maxHeight / targetHeight;
        const scale = Math.min(widthRatio, heightRatio);
        targetWidth = Math.round((targetWidth * scale) / 2) * 2; // ensure even number
        targetHeight = Math.round((targetHeight * scale) / 2) * 2;
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d", { alpha: false });

      if (!ctx) {
        URL.revokeObjectURL(videoUrl);
        resolve(file);
        return;
      }

      const stream = canvas.captureStream(fps);

      // Pick supported mimeType
      const mimeTypes = [
        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        "video/mp4",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];

      let selectedMime = "video/webm";
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: selectedMime,
          videoBitsPerSecond: videoBitrate,
        });
      } catch (err) {
        URL.revokeObjectURL(videoUrl);
        console.warn("MediaRecorder creation fallback:", err);
        resolve(file);
        return;
      }

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        URL.revokeObjectURL(videoUrl);
        const ext = selectedMime.includes("mp4") ? "mp4" : "webm";
        const blob = new Blob(chunks, { type: selectedMime });
        const compressedFile = new File(
          [blob],
          file.name.replace(/\.[^/.]+$/, `_compressed.${ext}`),
          { type: selectedMime, lastModified: Date.now() }
        );

        const compressedSizeMb = parseFloat(
          (compressedFile.size / (1024 * 1024)).toFixed(2)
        );
        const savedPercentage = Math.max(
          0,
          Math.round(((file.size - compressedFile.size) / file.size) * 100)
        );

        onProgress?.({
          percent: 100,
          originalSizeMb,
          compressedSizeMb,
          savedPercentage,
          status: "done",
          message: `Saved ${savedPercentage}% (${originalSizeMb}MB ➔ ${compressedSizeMb}MB)`,
        });

        resolve(compressedFile);
      };

      let animationFrameId: number;

      const drawFrame = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

        // Calculate progress based on playback currentTime
        const currentProgress = Math.min(
          95,
          Math.round((video.currentTime / duration) * 90) + 5
        );
        onProgress?.({
          percent: currentProgress,
          originalSizeMb,
          status: "compressing",
          message: `Compressing reel: ${currentProgress}%`,
        });

        animationFrameId = requestAnimationFrame(drawFrame);
      };

      video.onended = () => {
        cancelAnimationFrame(animationFrameId);
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 150);
      };

      // Start recording and playback
      mediaRecorder.start(100);
      video.play().then(() => {
        drawFrame();
      }).catch(() => {
        // Autoplay policy prevented playback, return original
        URL.revokeObjectURL(videoUrl);
        resolve(file);
      });
    };
  });
}
