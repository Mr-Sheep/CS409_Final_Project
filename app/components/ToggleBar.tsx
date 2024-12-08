import { motion } from "motion/react";

interface ToggleBarProps {
  value: boolean;
  onChange: (newValue: boolean) => void;
}

// some random youtube tutorial: https://www.youtube.com/watch?v=NevOIteYwu4

export default function ToggleBar({ value, onChange }: ToggleBarProps) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`ml-3 p-[1px] flex h-6 w-10 rounded-full border border-gray-900 ${
        !value ? "justify-start bg-white" : "justify-end bg-gray-900"
      }`}
    >
      <motion.div
        className={`h-5 w-5 rounded-full ${
          !value ? "bg-gray-900" : "bg-white"
        } justify-center`}
        layout
        transition={{ type: "spring", stiffness: 700, damping: 50 }}
      />
    </div>
  );
}
