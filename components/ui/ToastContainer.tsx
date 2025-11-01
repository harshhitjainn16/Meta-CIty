import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useNotifications,
  ToastNotification,
  NotificationType,
} from "@/contexts/NotificationContext";

const NotificationIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const NotificationColors = {
  success: {
    bg: "from-green-500/20 to-emerald-600/20",
    border: "border-green-400/50",
    icon: "text-green-400",
    glow: "shadow-green-400/20",
  },
  error: {
    bg: "from-red-500/20 to-pink-600/20",
    border: "border-red-400/50",
    icon: "text-red-400",
    glow: "shadow-red-400/20",
  },
  info: {
    bg: "from-blue-500/20 to-cyan-600/20",
    border: "border-blue-400/50",
    icon: "text-blue-400",
    glow: "shadow-blue-400/20",
  },
  warning: {
    bg: "from-yellow-500/20 to-orange-600/20",
    border: "border-yellow-400/50",
    icon: "text-yellow-400",
    glow: "shadow-yellow-400/20",
  },
};

interface ToastItemProps {
  notification: ToastNotification;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, onRemove }) => {
  const [progress, setProgress] = useState(100);
  const colors = NotificationColors[notification.type];
  const Icon = NotificationIcons[notification.type];

  useEffect(() => {
    if (notification.persistent) return;

    const duration = notification.duration || 5000;
    const interval = 50; // Update every 50ms
    const decrement = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onRemove(notification.id);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [notification, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        opacity: { duration: 0.2 },
      }}
      className={`
        relative overflow-hidden rounded-xl backdrop-blur-md border-2 
        bg-gradient-to-r ${colors.bg} ${colors.border}
        shadow-2xl ${colors.glow}
        min-w-[320px] max-w-[400px] p-4
      `}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 ${colors.bg} opacity-30 blur-xl`}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${colors.icon}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-orbitron font-bold text-white text-sm mb-1">
            {notification.title}
          </h4>
          <p className="text-gray-300 text-xs leading-relaxed">
            {notification.message}
          </p>

          {/* Action Button */}
          {notification.action && (
            <motion.button
              className={`
                mt-3 px-3 py-1.5 rounded-lg text-xs font-space-grotesk font-medium
                ${colors.icon} border ${colors.border} hover:bg-white/10
                transition-all duration-200
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={notification.action.onClick}
            >
              {notification.action.label}
            </motion.button>
          )}
        </div>

        {/* Close Button */}
        <motion.button
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(notification.id)}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Progress Bar */}
      {!notification.persistent && (
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-black/50`}>
          <motion.div
            className={`h-full ${colors.icon.replace(
              "text-",
              "bg-"
            )} opacity-60`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}
    </motion.div>
  );
};

const ToastContainer: React.FC = () => {
  const {
    notifications,
    removeNotification,
    clearAll,
    soundEnabled,
    toggleSound,
    notificationsEnabled,
    requestNotificationPermission,
  } = useNotifications();

  const handleRequestPermissions = async () => {
    await requestNotificationPermission();
  };

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 max-h-screen overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <ToastItem
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Control Panel */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-4 z-[9998]"
        >
          <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center gap-2">
            {/* Sound Toggle */}
            <motion.button
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              title={soundEnabled ? "Disable Sounds" : "Enable Sounds"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </motion.button>

            {/* Browser Notifications */}
            {!notificationsEnabled && (
              <motion.button
                className="px-3 py-2 text-xs font-space-grotesk text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRequestPermissions}
              >
                Enable Browser Notifications
              </motion.button>
            )}

            {/* Clear All */}
            {notifications.length > 1 && (
              <motion.button
                className="px-3 py-2 text-xs font-space-grotesk text-gray-400 border border-gray-600 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
              >
                Clear All
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ToastContainer;
