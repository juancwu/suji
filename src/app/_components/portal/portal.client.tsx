"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  target?: HTMLElement | string;
} & React.ComponentPropsWithoutRef<"div">;

export default function Portal(props: PortalProps) {
  const { children, target } = props;

  const [mounted, setMounted] = useState(false);
  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);

    if (!target)
      nodeRef.current = document.querySelector("notifications-portal");
    else if (typeof target === "string")
      nodeRef.current = document.querySelector(target);
    else nodeRef.current = target;
  }, [target]);

  if (!mounted || !nodeRef.current) return null;

  return createPortal(<>{children}</>, nodeRef.current);
}
