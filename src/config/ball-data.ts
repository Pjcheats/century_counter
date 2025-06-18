
import type { BallDefinition } from '@/types/ball-count';
import Ball11Icon from '@/components/icons/Ball11Icon';
import { Sun, Leaf, Nut, Droplet, Aperture, Moon, Heart } from 'lucide-react';

export const BALL_DEFINITIONS: BallDefinition[] = [
  {
    value: 2,
    name: "Yellow",
    colorHex: "#FDE047", // Tailwind yellow-300
    tailwindBg: "bg-yellow-300",
    tailwindText: "text-yellow-800",
    IconComponent: ({ className }) => <Sun className={className} />,
  },
  {
    value: 3,
    name: "Green",
    colorHex: "#86EFAC", // Tailwind green-300
    tailwindBg: "bg-green-300",
    tailwindText: "text-green-800",
    IconComponent: ({ className }) => <Leaf className={className} />,
  },
  {
    value: 4,
    name: "Brown",
    colorHex: "#D97706", // Tailwind amber-600 (for Brown/Maroon)
    tailwindBg: "bg-amber-600",
    tailwindText: "text-amber-100",
    IconComponent: ({ className }) => <Nut className={className} />,
  },
  {
    value: 5,
    name: "Blue",
    colorHex: "#60A5FA", // Tailwind blue-400
    tailwindBg: "bg-blue-400",
    tailwindText: "text-blue-900",
    IconComponent: ({ className }) => <Droplet className={className} />,
  },
  {
    value: 6,
    name: "Orange", // Using a slightly different orange than accent
    colorHex: "#FB923C", // Tailwind orange-400
    tailwindBg: "bg-orange-400",
    tailwindText: "text-orange-900",
    IconComponent: ({ className }) => <Aperture className={className} />,
  },
  {
    value: 7,
    name: "Black",
    colorHex: "#1F2937", // Tailwind gray-800 (softer black)
    tailwindBg: "bg-gray-800",
    tailwindText: "text-gray-100",
    IconComponent: ({ className }) => <Moon className={className} />,
  },
  {
    value: 11,
    name: "Striped",
    colorHex: "#FFFFFF",
    tailwindBg: "bg-white", // Base for icon
    tailwindText: "text-red-600", // For icon details or fallback
    IconComponent: Ball11Icon,
  },
  {
    value: 15,
    name: "Red",
    colorHex: "#F87171", // Tailwind red-400
    tailwindBg: "bg-red-400",
    tailwindText: "text-red-900",
    IconComponent: ({ className }) => <Heart className={className} />,
  },
];

