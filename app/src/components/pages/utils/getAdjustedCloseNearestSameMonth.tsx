function getAdjustedCloseNearestSameMonth(
  tradeDate: string,
  msci: Record<string, { "5. adjusted close": string }>
): number | null {
  if (!tradeDate) return null;

  const targetMonth = tradeDate.slice(0, 7); // e.g., '2024-12'
  const tradeTimestamp = new Date(tradeDate).getTime();

  const sameMonthDates = Object.entries(msci)
    .filter(([date]) => date.startsWith(targetMonth))
    .map(([date, data]) => ({
      date,
      adjustedClose: parseFloat(data["5. adjusted close"]),
      diff: Math.abs(tradeTimestamp - new Date(date).getTime()),
    }))
    .filter(item => !isNaN(item.adjustedClose)); // avoid NaN values

  if (sameMonthDates.length === 0) return null;

  const nearest = sameMonthDates.reduce((a, b) => (a.diff < b.diff ? a : b));
  return nearest.adjustedClose;
}

export default getAdjustedCloseNearestSameMonth;
