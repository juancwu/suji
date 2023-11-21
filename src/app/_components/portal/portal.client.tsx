"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function createPortalNode() {
  const node = document.createElement("div");
  node.setAttribute("data-portal", "true");
  return node;
}

export type PortalProps = {
  target?: HTMLElement | string;
} & React.ComponentPropsWithoutRef<"div">;

export default function Portal(props: PortalProps) {
  const { children, target } = props;

  const [mounted, setMounted] = useState(false);
  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    console.log("here");
    setMounted(true);

    if (!target) nodeRef.current = createPortalNode();
    else if (typeof target === "string")
      nodeRef.current = document.querySelector(target);
    else nodeRef.current = target;

    if (!target && nodeRef.current) document.body.appendChild(nodeRef.current);

    return () => {
      if (!target && nodeRef.current)
        document.body.removeChild(nodeRef.current);
    };
  }, [target]);

  if (!mounted || !nodeRef.current) return null;

  return createPortal(<>{children}</>, nodeRef.current);
}
