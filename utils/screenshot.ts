import { useThree } from "@react-three/fiber";
import { useCallback } from "react";

export interface ScreenshotOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "png" | "jpeg" | "webp";
  watermark?: WatermarkConfig;
}

export interface WatermarkConfig {
  enabled: boolean;
  text?: string;
  stats?: {
    buildings: number;
    sustainability: number;
    level: number;
    rewards: number;
  };
  position?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "bottom-center";
  style?: "minimal" | "detailed" | "social";
}

export interface SocialPreset {
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  platform: string;
  description: string;
}

export const SOCIAL_PRESETS: Record<string, SocialPreset> = {
  twitter: {
    name: "Twitter",
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
    platform: "Twitter",
    description: "Optimized for Twitter posts and cards",
  },
  instagram_post: {
    name: "Instagram Post",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    platform: "Instagram",
    description: "Square format for Instagram feed",
  },
  instagram_story: {
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    platform: "Instagram",
    description: "Vertical format for Instagram Stories",
  },
  facebook: {
    name: "Facebook",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    platform: "Facebook",
    description: "Optimized for Facebook posts and sharing",
  },
  linkedin: {
    name: "LinkedIn",
    width: 1200,
    height: 627,
    aspectRatio: "1.91:1",
    platform: "LinkedIn",
    description: "Professional format for LinkedIn",
  },
  discord: {
    name: "Discord",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    platform: "Discord",
    description: "High quality for Discord sharing",
  },
};

class CityScreenshotManager {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  async captureScene(
    renderer: any,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    const {
      width = 1200,
      height = 675,
      quality = 0.95,
      format = "png",
    } = options;

    // Create a temporary canvas with desired dimensions
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d")!;

    // Get the WebGL canvas
    const glCanvas = renderer.domElement as HTMLCanvasElement;

    // Draw the 3D scene to our temp canvas, scaling it to fit
    tempCtx.drawImage(glCanvas, 0, 0, width, height);

    // Add watermark if enabled
    if (options.watermark?.enabled) {
      await this.addWatermark(tempCtx, width, height, options.watermark);
    }

    // Convert to data URL
    const mimeType = `image/${format}`;
    return tempCanvas.toDataURL(mimeType, quality);
  }

  private async addWatermark(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: WatermarkConfig
  ) {
    const { stats, position = "bottom-right", style = "detailed" } = config;

    // Set up fonts and styles
    const fontSize = Math.max(14, Math.min(24, width / 60));
    const padding = fontSize;
    const lineHeight = fontSize * 1.4;

    ctx.font = `bold ${fontSize}px 'Orbitron', monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Create gradient background for watermark
    const watermarkHeight =
      style === "minimal" ? lineHeight * 2 : lineHeight * 6;
    const watermarkWidth = width * 0.35;

    let x = padding;
    let y = height - watermarkHeight - padding;

    if (position.includes("top")) {
      y = padding;
    }
    if (position.includes("right")) {
      x = width - watermarkWidth - padding;
      ctx.textAlign = "right";
    }
    if (position.includes("center")) {
      x = (width - watermarkWidth) / 2;
      ctx.textAlign = "center";
    }

    // Draw semi-transparent background
    const gradient = ctx.createLinearGradient(
      x,
      y,
      x + watermarkWidth,
      y + watermarkHeight
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.8)");
    gradient.addColorStop(1, "rgba(0, 20, 40, 0.9)");

    ctx.fillStyle = gradient;
    ctx.fillRect(
      x - padding / 2,
      y - padding / 2,
      watermarkWidth + padding,
      watermarkHeight + padding
    );

    // Draw border
    ctx.strokeStyle = "rgba(0, 212, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      x - padding / 2,
      y - padding / 2,
      watermarkWidth + padding,
      watermarkHeight + padding
    );

    // Draw MetaCity branding
    ctx.fillStyle = "#00d4ff";
    ctx.font = `bold ${fontSize * 1.2}px 'Orbitron', monospace`;

    const brandText = "🏙️ MetaCity";
    const brandX = position.includes("right")
      ? x - padding / 2
      : x + padding / 2;
    ctx.fillText(brandText, brandX, y);

    if (style === "minimal") {
      ctx.fillStyle = "#ffffff";
      ctx.font = `${fontSize * 0.8}px 'Space Grotesk', sans-serif`;
      ctx.fillText("Build. Govern. Prosper.", brandX, y + lineHeight);
      return;
    }

    // Draw stats if provided
    if (stats) {
      ctx.fillStyle = "#ffffff";
      ctx.font = `${fontSize * 0.9}px 'Space Grotesk', sans-serif`;

      const statsY = y + lineHeight * 1.8;
      const statsList = [
        `🏢 Buildings: ${stats.buildings}`,
        `🌱 Sustainability: ${stats.sustainability}%`,
        `⭐ Level: ${stats.level}`,
        `💰 Rewards: ${stats.rewards.toLocaleString()} MTC`,
      ];

      statsList.forEach((stat, index) => {
        ctx.fillText(stat, brandX, statsY + index * lineHeight * 0.8);
      });
    }

    // Add timestamp
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = `${fontSize * 0.7}px 'Space Grotesk', sans-serif`;
    const timestamp = new Date().toLocaleDateString();
    ctx.fillText(timestamp, brandX, y + watermarkHeight - lineHeight * 0.5);
  }

  async downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async shareToClipboard(dataUrl: string): Promise<boolean> {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to copy image to clipboard:", error);
      return false;
    }
  }

  compressImage(dataUrl: string, quality: number = 0.8): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = dataUrl;
    }) as any;
  }
}

// Create screenshot functions that can be used with a renderer instance
export const createScreenshotFunctions = (renderer: THREE.WebGLRenderer) => {
  const screenshotManager = new CityScreenshotManager();

  const captureCity = async (options: ScreenshotOptions = {}) => {
    try {
      const dataUrl = await screenshotManager.captureScene(renderer, options);
      return dataUrl;
    } catch (error) {
      console.error("Failed to capture city screenshot:", error);
      throw error;
    }
  };

  const downloadCity = async (
    options: ScreenshotOptions & { filename?: string } = {}
  ) => {
    try {
      const dataUrl = await captureCity(options);
      const filename =
        options.filename || `metacity-${Date.now()}.${options.format || "png"}`;
      await screenshotManager.downloadImage(dataUrl, filename);
      return dataUrl;
    } catch (error) {
      console.error("Failed to download city screenshot:", error);
      throw error;
    }
  };

  const shareCity = async (options: ScreenshotOptions = {}) => {
    try {
      const dataUrl = await captureCity(options);
      const success = await screenshotManager.shareToClipboard(dataUrl);
      return { dataUrl, shared: success };
    } catch (error) {
      console.error("Failed to share city screenshot:", error);
      throw error;
    }
  };

  return {
    captureCity,
    downloadCity,
    shareCity,
    screenshotManager,
  };
};
