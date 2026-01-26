import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  href,
  onClick,
}: {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
}) => {
  const CardContent = () => (
    <>
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200 relative">
        <div className="flex items-center justify-between">
            {icon}
            {href && (
                <ArrowUpRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover/bento:opacity-100 transition-opacity" />
            )}
        </div>
        <div className="font-sans font-bold text-neutral-600 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs">
          {description}
        </div>
      </div>
    </>
  );

  const containerClasses = cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-white border border-transparent justify-between flex flex-col space-y-4 cursor-pointer",
        className
      );

  if (href) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className={containerClasses}>
          <motion.div whileHover={{ y: -5 }} className="h-full flex flex-col justify-between">
            <CardContent />
          </motion.div>
        </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={containerClasses}
      onClick={onClick}
    >
        <CardContent />
    </motion.div>
  );
};
