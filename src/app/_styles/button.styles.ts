import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import type { ClassProp } from "class-variance-authority/types";

export const buttonStyles = cva("font-semibold text-sm", {
  variants: {
    intent: {
      primary:
        "shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
      secondary:
        "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    },
    size: {
      xs: "rounded px-2 py-1 text-xs",
      sm: "rounded px-2 py-1",
      md: "rounded-md px-2.5 py-1.5",
      lg: "rounded-md px-3 py-2",
      xl: "rounded-md px-3.5 py-2.5",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "xl",
  },
});

export type ButtonStylesProps = VariantProps<typeof buttonStyles>;

export function getButtonStyles(config?: ButtonStylesProps & ClassProp) {
  return twMerge(buttonStyles(config));
}
