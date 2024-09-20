import type { VariantProps } from "cva";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

import { cn, cva } from "./cn";

const buttonVariants = cva({
  base: "inline-flex w-full shrink-0 flex-row items-center justify-center gap-[--button-gap] rounded-none transition disabled:cursor-not-allowed disabled:opacity-40",
  variants: {
    variant: {
      primary: "bg-main-100 text-main-950 hover:bg-white",
      secondary: "bg-main-700 text-main-50 hover:bg-main-600",
      ghost: "bg-transparent text-main-50 hover:bg-main-700",
    },
    size: {
      sm: "px-3 py-1 text-sm [--button-gap:0.25rem] [&_svg]:size-4",
      md: "px-4 py-2 text-base [--button-gap:0.5rem] [&_svg]:size-6",
      lg: "px-5 py-2.5 text-lg [--button-gap:0.75rem] [&_svg]:size-7",
      "icon-sm": "h-[30px] w-[30px] p-1 [--button-gap:0.25rem] [&_svg]:size-4",
      "icon-md": "h-[42px] w-[42px] p-2 [--button-gap:0.5rem] [&_svg]:size-6",
      "icon-lg": "h-[50px] w-[50px] p-2.5 [--button-gap:0.75rem] [&_svg]:size-7",
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "md",
  },
});

export const Button = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { variants?: VariantProps<typeof buttonVariants> }
>(function Button({ variants, className, children, ...rest }, ref) {
  return (
    <button
      className={cn(buttonVariants({ ...variants, className }))}
      type="button"
      {...rest}
      ref={ref}
    >
      {children}
    </button>
  );
});

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link> & { variants?: VariantProps<typeof buttonVariants> }
>(function LinkButton({ variants, className, children, ...rest }, ref) {
  return (
    <Link className={cn(buttonVariants({ ...variants, className }))} {...rest} ref={ref}>
      {children}
    </Link>
  );
});
