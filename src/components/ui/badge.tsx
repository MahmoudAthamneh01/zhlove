import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-zh-accent text-white hover:bg-zh-accent/80",
        secondary: "border-transparent bg-zh-secondary text-white hover:bg-zh-secondary/80",
        destructive: "border-transparent bg-zh-red text-white hover:bg-zh-red/80",
        outline: "text-foreground",
        success: "border-transparent bg-zh-accent text-white hover:bg-zh-accent/80",
        warning: "border-transparent bg-zh-gold text-black hover:bg-zh-gold/80",
        info: "border-transparent bg-zh-blue text-white hover:bg-zh-blue/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 