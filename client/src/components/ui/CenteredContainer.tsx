import { type FC } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof centeredContainerVariants> {}

const centeredContainerVariants = cva(
  "bg-black font-bold text-white flex justify-center items-center",
  {
    variants: {
      minHeight: {
        parent: "min-h-full",
        screen: "min-h-screen",
      },
    },
    defaultVariants: {
      minHeight: "screen",
    },
  }
);

const CenteredContainer: FC<Props> = ({ minHeight, className, children, ...props }) => {
  return (
    <div
      {...props}
      className={cn(centeredContainerVariants({ minHeight, className }))}
    >
      {children}
    </div>
  );
};

export default CenteredContainer;
