import { cn } from "../../utils/cn";
import { type VariantProps, cva } from "class-variance-authority";
import { type FC } from "react";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text: string;
}

const buttonVariants = cva(
  "bg-emerald-600 enabled:hover:bg-emerald-700 transition-all duration-250 ease-in-out rounded-lg p-2.5 text-sm cursor-pointer",
  {
    variants: {
      variant: {
        danger: "bg-red-600 enabled:hover:bg-red-700",
      },
      size: {
        xs: "w-20",
        sm: "w-40",
        md: "w-56",
        lg: "w-3/5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const Button: FC<Props> = ({ text = "Click me", size, variant, className, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
