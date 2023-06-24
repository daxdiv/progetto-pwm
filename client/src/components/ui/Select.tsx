import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { BiSolidDownArrow } from "react-icons/bi";

interface Props
  extends React.HTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  data: string[];
}

const selectVariants = cva(
  "appearance-none outline-none border focus:border-emerald-600 block rounded-lg border-2 p-2.5 text-sm",
  {
    variants: {
      variant: {
        neutral:
          "border-gray-300 bg-gray-50 dark:text-white placeholder-gray-700 dark:placeholder-gray-500 dark:bg-gray-700 dark:border-gray-500",
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

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ size, className, placeholder, data, ...props }, ref) => {
    return (
      <div className="relative">
        <BiSolidDownArrow className="absolute right-4 top-[0.9rem] text-emerald-600 text-sm" />
        <select
          ref={ref}
          placeholder={placeholder || "Placeholder"}
          {...props}
          required
          disabled={data.length === 0}
          className={cn(selectVariants({ size, className }))}
        >
          <option
            value={placeholder}
            disabled
          >
            {placeholder}
          </option>
          {data.map(genre => (
            <option
              key={genre}
              value={genre.charAt(0).toUpperCase() + genre.slice(1)}
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
