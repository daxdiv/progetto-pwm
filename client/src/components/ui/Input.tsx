import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva(
  "outline-none border focus:border-emerald-600 block w-full rounded-lg border-2 p-2.5 text-sm",
  {
    variants: {
      variant: {
        success:
          "border-green-500 bg-green-50 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 dark:bg-gray-700 dark:border-green-500",
        error:
          "border-red-500 bg-red-50 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 dark:bg-gray-700 dark:border-red-500",
        neutral:
          "border-gray-300 bg-gray-50 dark:text-white placeholder-gray-700 dark:placeholder-gray-500 dark:bg-gray-800 dark:border-gray-500",
      },
      size: {
        sm: "w-56",
        md: "w-96",
        lg: "w-3/5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

const Input = forwardRef<HTMLInputElement, Props>(
  ({ variant, size, className, type, placeholder, ...props }, ref) => {
    return (
      <input
        type={type || "text"}
        ref={ref}
        placeholder={placeholder || "Placeholder"}
        {...props}
        required
        className={cn(inputVariants({ variant, size, className }))}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
