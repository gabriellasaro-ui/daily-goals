import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  completed: boolean;
  date?: string;
  time?: string;
  priority?: string;
}

export const useNotifications = (missions: Mission[]) => {
  const notifiedRef = useRef<Set<string>>(new Set());

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("Seu navegador não suporta notificações");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  const sendNotification = useCallback((mission: Mission) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("🎯 Lembrete de Missão!", {
        body: mission.title,
        icon: "/favicon.ico",
        tag: mission.id,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, []);

  useEffect(() => {
    const checkMissions = () => {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().slice(0, 5);

      missions.forEach((mission) => {
        if (
          mission.date &&
          mission.time &&
          !mission.completed &&
          !notifiedRef.current.has(mission.id)
        ) {
          if (mission.date === currentDate && mission.time <= currentTime) {
            sendNotification(mission);
            notifiedRef.current.add(mission.id);
            toast.info(`⏰ Hora da missão: ${mission.title}`);
          }
        }
      });
    };

    // Check immediately
    checkMissions();

    // Check every minute
    const interval = setInterval(checkMissions, 60000);

    return () => clearInterval(interval);
  }, [missions, sendNotification]);

  return { requestPermission };
};
