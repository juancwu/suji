import { nanoid } from "nanoid";
import { createStore, useStore, type Store } from "../store/store.client";
import type { NotificationProps } from "./notification.client";

// TODO: add auto hide notification feature

export interface NotificationData extends Omit<NotificationProps, "onClose"> {
  id?: string;
  variant?: "info" | "success" | "error" | "warning";
  onClose?: (data: NotificationData) => void;
  onOpen?: (data: NotificationData) => void;
}

export interface NotificationsState {
  notifications: NotificationData[];
  queue: NotificationData[];
  limit: number;
}

export type NotificationsStore = Store<NotificationsState>;

export const notificationsStore = createStore<NotificationsState>({
  notifications: [],
  queue: [],
  limit: 5,
});

export const useNotifications = (
  store: NotificationsStore = notificationsStore,
) => useStore(store);

export function updateNotificationsState(
  store: NotificationsStore,
  update: (notifications: NotificationData[]) => NotificationData[],
) {
  const state = store.getState();
  const notifications = update([...state.notifications, ...state.queue]);

  store.setState({
    notifications: notifications.slice(0, state.limit),
    queue: notifications.slice(state.limit),
    limit: state.limit,
  });
}

export function showNotification(
  notification: NotificationData,
  store: NotificationsStore = notificationsStore,
) {
  const id = notification.id ?? nanoid(8);

  updateNotificationsState(store, (notifications) => {
    if (
      notification.id &&
      notifications.some((n) => n.id === notification.id)
    ) {
      return notifications;
    }

    return [...notifications, { ...notification, id }];
  });

  return id;
}

export function hideNotification(
  id: string,
  store: NotificationsStore = notificationsStore,
) {
  updateNotificationsState(store, (notifications) =>
    notifications.filter((notification) => {
      if (notification.id === id) {
        notification.onClose?.(notification);
        return false;
      }

      return true;
    }),
  );
}
