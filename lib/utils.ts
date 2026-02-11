import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function getPhaseProgress(
  phase: 'sensing' | 'debating' | 'trading' | 'reviewing',
  currentMinute: number
): number {
  const phases = {
    sensing: { start: 0, end: 2 },
    debating: { start: 2, end: 10 },
    trading: { start: 10, end: 40 },
    reviewing: { start: 40, end: 40 },
  };

  const { start, end } = phases[phase];
  return ((currentMinute - start) / (end - start)) * 100;
}
