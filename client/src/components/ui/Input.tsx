import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva(
  "outline-none border border-gray-500 bg-gray-800 font-normal md:font-bold lg:font-bold text-white placeholder-gray-500 focus:border-emerald-600 block w-full rounded-lg md:border-2 lg:border-2 p-2.5 text-xs md:text-sm lg:text-sm",
  {
    variants: {
      size: {
        sm: "w-56",
        md: "w-96",
        lg: "w-3/5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const Input = forwardRef<HTMLInputElement, Props>(
  ({ size, className, type, placeholder, ...props }, ref) => {
    return (
      <input
        type={type || "text"}
        ref={ref}
        placeholder={placeholder || "Placeholder"}
        {...props}
        required
        className={cn(inputVariants({ size, className }))}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
