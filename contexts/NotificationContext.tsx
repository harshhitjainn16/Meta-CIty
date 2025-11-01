import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface ToastNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: ToastNotification[];
  showToast: (notification: Omit<ToastNotification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  playSound: (
    soundType: "success" | "error" | "vote" | "mint" | "claim" | "notification"
  ) => void;
  showBrowserNotification: (
    title: string,
    options?: NotificationOptions
  ) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  notificationsEnabled: boolean;
  requestNotificationPermission: () => Promise<NotificationPermission>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  // Sound effects map
  const sounds = {
    success: "/sounds/success.mp3",
    error: "/sounds/error.mp3",
    vote: "/sounds/vote.mp3",
    mint: "/sounds/mint.mp3",
    claim: "/sounds/claim.mp3",
    notification: "/sounds/notification.mp3",
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = useCallback(
    (notification: Omit<ToastNotification, "id">) => {
      const id = generateId();
      const newNotification: ToastNotification = {
        ...notification,
        id,
        duration: notification.duration ?? 5000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto remove if not persistent
      if (!newNotification.persistent) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const playSound = useCallback(
    (soundType: keyof typeof sounds) => {
      if (!soundEnabled) return;

      try {
        const audio = new Audio(sounds[soundType]);
        audio.volume = 0.6;
        audio.play().catch(() => {
          // Fallback to system beep if audio files not available
          if ("AudioContext" in window || "webkitAudioContext" in window) {
            const AudioContext =
              window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different frequencies for different sound types
            const frequencies = {
              success: 800,
              error: 300,
              vote: 600,
              mint: 1000,
              claim: 900,
              notification: 500,
            };

            oscillator.frequency.setValueAtTime(
              frequencies[soundType],
              audioContext.currentTime
            );
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.3
            );

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
          }
        });
      } catch (error) {
        console.warn("Could not play notification sound:", error);
      }
    },
    [soundEnabled]
  );

  const showBrowserNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!notificationsEnabled || !("Notification" in window)) return;

      const defaultOptions: NotificationOptions = {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "metacity-notification",
        ...options,
      };

      try {
        new Notification(title, defaultOptions);
        playSound("notification");
      } catch (error) {
        console.warn("Could not show browser notification:", error);
      }
    },
    [notificationsEnabled, playSound]
  );

  const requestNotificationPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      if (!("Notification" in window)) {
        return "denied";
      }

      if (Notification.permission === "granted") {
        setNotificationsEnabled(true);
        return "granted";
      }

      if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === "granted");
        return permission;
      }

      return Notification.permission;
    }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
    localStorage.setItem("metacity-sound-enabled", (!soundEnabled).toString());
  }, [soundEnabled]);

  // Load sound preference from localStorage
  useEffect(() => {
    const savedSoundPref = localStorage.getItem("metacity-sound-enabled");
    if (savedSoundPref !== null) {
      setSoundEnabled(savedSoundPref === "true");
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    showToast,
    removeNotification,
    clearAll,
    playSound,
    showBrowserNotification,
    soundEnabled,
    toggleSound,
    notificationsEnabled,
    requestNotificationPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
