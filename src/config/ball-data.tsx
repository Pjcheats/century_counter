
import type { BallDefinition } from '@/types/ball-count';
import Ball2Icon from '@/components/icons/Ball2Icon';
import Ball3Icon from '@/components/icons/Ball3Icon';
import Ball4Icon from '@/components/icons/Ball4Icon';
import Ball5Icon from '@/components/icons/Ball5Icon';
import Ball6Icon from '@/components/icons/Ball6Icon';
import Ball7Icon from '@/components/icons/Ball7Icon';
import Ball11Icon from '@/components/icons/Ball11Icon';
import Ball15Icon from '@/components/icons/Ball15Icon';

export const BALL_DEFINITIONS: BallDefinition[] = [
  {
    value: 2,
    name: "Yellow",
    colorHex: "#FACC15", // Tailwind yellow-400
    tailwindBg: "bg-yellow-400", // Fallback or for other UI elements
    tailwindText: "text-black",   // Fallback or for other UI elements
    IconComponent: Ball2Icon,
  },
  {
    value: 3,
    name: "Green",
    colorHex: "#10B981", // Tailwind emerald-500
    tailwindBg: "bg-emerald-500",
    tailwindText: "text-white",
    IconComponent: Ball3Icon,
  },
  {
    value: 4,
    name: "Brown", // Represented as Maroon/Rose
    colorHex: "#BE123C", // Tailwind rose-700
    tailwindBg: "bg-rose-700",
    tailwindText: "text-white",
    IconComponent: Ball4Icon,
  },
  {
    value: 5,
    name: "Blue",
    colorHex: "#0EA5E9", // Tailwind sky-500
    tailwindBg: "bg-sky-500",
    tailwindText: "text-white",
    IconComponent: Ball5Icon,
  },
  {
    value: 6,
    name: "Orange",
    colorHex: "#F97316", // Tailwind orange-500
    tailwindBg: "bg-orange-500",
    tailwindText: "text-white",
    IconComponent: Ball6Icon,
  },
  {
    value: 7,
    name: "Black",
    colorHex: "#111827", // Tailwind gray-900 (SVG uses a slightly lighter gradient)
    tailwindBg: "bg-black",
    tailwindText: "text-white",
    IconComponent: Ball7Icon,
  },
  {
    value: 11,
    name: "Striped", // Red stripe
    colorHex: "#EF4444", // Stripe color, base is white
    tailwindBg: "bg-white", 
    tailwindText: "text-red-500",
    IconComponent: Ball11Icon,
  },
  {
    value: 15,
    name: "Red",
    colorHex: "#EF4444", // Tailwind red-500
    tailwindBg: "bg-red-500",
    tailwindText: "text-white",
    IconComponent: Ball15Icon,
  },
];
