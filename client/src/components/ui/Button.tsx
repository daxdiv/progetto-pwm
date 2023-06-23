import { cn } from "../../utils/cn";
import { type VariantProps, cva } from "class-variance-authority";
import { type FC } from "react";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text: string;
}

const buttonVariants = cva(
  "bg-emerald-600 hover:bg-emerald-700 transition-all duration-250 ease-in-out rounded-lg p-2.5 text-sm cursor-pointer",
  {
    variants: {
      size: {
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

const Button: FC<Props> = ({ text = "Click me", className, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ className }))}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
