"use client";

import Portal from "@/app/_components/portal/portal.client";
import type { PortalProps } from "@/app/_components/portal/portal.client";
import Notification from "./notification.client";
import { useNotifications } from "./notifications.utils";

export interface NotificationsProps {
  portalProps?: Omit<PortalProps, "children">;
}

export default function Notifications(props: NotificationsProps) {
  const { portalProps } = props;

  const data = useNotifications();

  const items = data.notifications.map((n) => (
    <Notification key={n.id} title={n.title} details={n.details} />
  ));

  return (
    <Portal {...portalProps}>
      <div className="fixed right-4 top-16 z-50 w-[calc(100%_-_2rem)] max-w-md">
        {items}
      </div>
    </Portal>
  );
}
