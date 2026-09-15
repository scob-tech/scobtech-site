import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full font-medium whitespace-nowrap transition-all duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-primary-foreground shadow-[0_0_0_1px_rgba(20,184,166,.4),0_8px_30px_-8px_rgba(20,184,166,.6),inset_0_1px_0_rgba(255,255,255,.35)] hover:-translate-y-0.5 hover:bg-[#2dd4bf] hover:shadow-[0_0_0_1px_rgba(45,212,191,.5),0_14px_40px_-8px_rgba(20,184,166,.75),inset_0_1px_0_rgba(255,255,255,.4)]",
        secondary:
          "border border-line-strong bg-white/[0.03] text-foreground backdrop-blur hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]",
        ghost: "text-muted-foreground hover:bg-white/5 hover:text-foreground",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-7 text-[15px]",
        xl: "h-14 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
