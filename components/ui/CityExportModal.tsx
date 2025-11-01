import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Download,
  Share2,
  Copy,
  Settings,
  X,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  Monitor,
  Smartphone,
  Loader2,
} from "lucide-react";
import { SOCIAL_PRESETS, ScreenshotOptions } from "@/utils/screenshot";

interface ScreenshotFunctions {
  captureCity: (options?: ScreenshotOptions) => Promise<string>;
  downloadCity: (
    options?: ScreenshotOptions & { filename?: string }
  ) => Promise<string>;
  shareCity: (
    options?: ScreenshotOptions
  ) => Promise<{ dataUrl: string; shared: boolean }>;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityStats: {
    buildings: number;
    sustainability: number;
    level: number;
    rewards: number;
  };
  screenshotFunctions: ScreenshotFunctions;
}

const PlatformIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Twitter: Twitter,
  Instagram: Instagram,
  Facebook: Facebook,
  LinkedIn: Linkedin,
  Discord: MessageCircle,
};

export const CityExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cityStats,
  screenshotFunctions,
}) => {
  const [selectedPreset, setSelectedPreset] = useState("twitter");
  const [customDimensions, setCustomDimensions] = useState({
    width: 1200,
    height: 675,
  });
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkStyle, setWatermarkStyle] = useState<
    "minimal" | "detailed" | "social"
  >("detailed");
  const [quality, setQuality] = useState(95);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { captureCity, downloadCity, shareCity } = screenshotFunctions;

  const handleExport = async (action: "download" | "share" | "preview") => {
    setIsExporting(true);

    try {
      const preset = SOCIAL_PRESETS[selectedPreset];
      const options: ScreenshotOptions = {
        width: preset ? preset.width : customDimensions.width,
        height: preset ? preset.height : customDimensions.height,
        quality: quality / 100,
        format,
        watermark: {
          enabled: watermarkEnabled,
          stats: cityStats,
          style: watermarkStyle,
          position: "bottom-right",
        },
      };

      if (action === "preview") {
        const dataUrl = await captureCity(options);
        setPreviewUrl(dataUrl);
        console.log("Preview generated");
      } else if (action === "download") {
        const filename = `metacity-${
          preset ? preset.platform.toLowerCase() : "custom"
        }-${Date.now()}.${format}`;
        await downloadCity({ ...options, filename });
        console.log(`Image downloaded: ${filename}`);
      } else if (action === "share") {
        const { dataUrl, shared } = await shareCity(options);

        if (shared) {
          console.log("Image copied to clipboard");
        } else {
          // Fallback to download
          const link = document.createElement("a");
          link.download = `metacity-share-${Date.now()}.${format}`;
          link.href = dataUrl;
          link.click();

          console.log("Download started as fallback");
        }
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getFileSizeEstimate = (preset: string) => {
    const p = SOCIAL_PRESETS[preset];
    if (!p) return "N/A";

    const pixels = p.width * p.height;
    const baseSize =
      pixels * (format === "png" ? 4 : format === "webp" ? 1 : 3);
    const qualityFactor = format === "png" ? 1 : quality / 100;
    const sizeKB = Math.round((baseSize * qualityFactor) / 1024);

    return sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)}MB` : `${sizeKB}KB`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gradient-to-br from-gray-900 to-black border border-cyan-400/30 rounded-2xl p-6 mx-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-orbitron font-bold text-white">
                📸 Export Your City
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Settings */}
            <div className="space-y-6">
              {/* Social Media Presets */}
              <div>
                <h3 className="font-orbitron text-lg text-white mb-4">
                  📱 Platform Presets
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(SOCIAL_PRESETS).map(([key, preset]) => {
                    const Icon = PlatformIcons[preset.platform] || Monitor;
                    return (
                      <motion.button
                        key={key}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedPreset === key
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPreset(key)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span className="font-space-grotesk text-white text-sm font-medium">
                            {preset.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {preset.width}×{preset.height}
                        </div>
                        <div className="text-xs text-gray-500">
                          {preset.aspectRatio} • {getFileSizeEstimate(key)}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Dimensions */}
              <div>
                <h3 className="font-orbitron text-lg text-white mb-4">
                  📐 Custom Size
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      value={customDimensions.width}
                      onChange={(e) =>
                        setCustomDimensions((prev) => ({
                          ...prev,
                          width: parseInt(e.target.value) || 1200,
                        }))
                      }
                      className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                      min="200"
                      max="4000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      value={customDimensions.height}
                      onChange={(e) =>
                        setCustomDimensions((prev) => ({
                          ...prev,
                          height: parseInt(e.target.value) || 675,
                        }))
                      }
                      className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                      min="200"
                      max="4000"
                    />
                  </div>
                </div>
              </div>

              {/* Watermark Settings */}
              <div>
                <h3 className="font-orbitron text-lg text-white mb-4">
                  🎨 Watermark
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={watermarkEnabled}
                      onChange={(e) => setWatermarkEnabled(e.target.checked)}
                      className="w-4 h-4 text-cyan-400 bg-black border-gray-600 rounded focus:ring-cyan-400"
                    />
                    <span className="text-white text-sm">Enable watermark</span>
                  </label>

                  {watermarkEnabled && (
                    <div className="grid grid-cols-3 gap-2">
                      {(["minimal", "detailed", "social"] as const).map(
                        (style) => (
                          <button
                            key={style}
                            onClick={() => setWatermarkStyle(style)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                              watermarkStyle === style
                                ? "bg-cyan-400 text-black"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                          >
                            {style}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Format & Quality */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-orbitron text-white mb-2">📄 Format</h4>
                  <select
                    value={format}
                    onChange={(e) =>
                      setFormat(e.target.value as "png" | "jpeg" | "webp")
                    }
                    className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="png">PNG (Best Quality)</option>
                    <option value="jpeg">JPEG (Smaller Size)</option>
                    <option value="webp">WebP (Modern)</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-orbitron text-white mb-2">
                    ⚙️ Quality ({quality}%)
                  </h4>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Preview & Actions */}
            <div className="space-y-6">
              {/* Preview */}
              <div>
                <h3 className="font-orbitron text-lg text-white mb-4">
                  👁️ Preview
                </h3>
                <div className="aspect-video bg-gray-900 rounded-xl border border-gray-600 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="City Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        Click "Generate Preview" to see your export
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Display */}
              <div className="bg-black/50 border border-gray-600 rounded-xl p-4">
                <h4 className="font-orbitron text-white mb-3">📊 City Stats</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🏢 Buildings:</span>
                    <span className="text-white font-bold">
                      {cityStats.buildings}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🌱 Sustainability:</span>
                    <span className="text-green-400 font-bold">
                      {cityStats.sustainability}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⭐ Level:</span>
                    <span className="text-yellow-400 font-bold">
                      {cityStats.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💰 Rewards:</span>
                    <span className="text-cyan-400 font-bold">
                      {cityStats.rewards.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-orbitron font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport("preview")}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                  Generate Preview
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-orbitron font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport("download")}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>

                  <motion.button
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-orbitron font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport("share")}
                    disabled={isExporting}
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CityExportModal;
