import type { Currency } from '../data/types';

const dateFmt = new Intl.DateTimeFormat('he-IL', { dateStyle: 'medium' });
const dateLongFmt = new Intl.DateTimeFormat('he-IL', { dateStyle: 'long' });
const dayMonthFmt = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'short' });
const weekdayFmt = new Intl.DateTimeFormat('he-IL', { weekday: 'short' });
const monthYearFmt = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' });

const currencyFmts: Record<Currency, Intl.NumberFormat> = {
  ILS: new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
};

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatDateLong(iso: string): string {
  return dateLongFmt.format(new Date(iso));
}

export function formatDayMonth(iso: string): string {
  return dayMonthFmt.format(new Date(iso));
}

export function formatWeekday(iso: string): string {
  return weekdayFmt.format(new Date(iso));
}

export function formatMonthYear(iso: string): string {
  return monthYearFmt.format(new Date(iso));
}

export function formatMoney(amount: number, currency: Currency): string {
  return currencyFmts[currency].format(amount);
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMin = Math.round((then - now.getTime()) / 60000);
  const abs = Math.abs(diffMin);
  const rtf = new Intl.RelativeTimeFormat('he-IL', { numeric: 'auto' });
  if (abs < 60) return rtf.format(diffMin, 'minute');
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, 'hour');
  const diffDay = Math.round(diffHr / 24);
  if (Math.abs(diffDay) < 14) return rtf.format(diffDay, 'day');
  const diffWk = Math.round(diffDay / 7);
  if (Math.abs(diffWk) < 9) return rtf.format(diffWk, 'week');
  const diffMo = Math.round(diffDay / 30);
  return rtf.format(diffMo, 'month');
}

export function isOverdue(iso: string, now: Date = new Date()): boolean {
  return new Date(iso).getTime() < now.getTime();
}

export function startOfDay(d: Date = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
