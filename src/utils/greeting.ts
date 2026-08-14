export type GreetingPeriod = 'morning' | 'afternoon' | 'evening';

export function getGreetingPeriod(date = new Date()): GreetingPeriod {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function getGreeting(date = new Date()): string {
  const period = getGreetingPeriod(date);
  if (period === 'morning') return 'Bonjour Mélissa';
  if (period === 'afternoon') return 'Bon après-midi Mélissa';
  return 'Bonsoir Mélissa';
}
