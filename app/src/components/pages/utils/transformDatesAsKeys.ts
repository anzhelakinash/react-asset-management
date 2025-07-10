type TimeSeriesData = Record<string, any>; 

export function filterAndTransformTimeSeries(
 timeSeries: TimeSeriesData | null | undefined,
  fromDate?: Date,
  toDate?: Date
): TimeSeriesData {
  if (!timeSeries) {
    return {};
  }

  const keys = Object.keys(timeSeries);

  if (!fromDate || !toDate) {
    return keys.reduce((obj, key) => {
      const [year, month, day] = key.split('-');
      const transformedDate = `${day}.${month}.${year}`;
      obj[key] = {
        ...timeSeries[key],
        trade_date: transformedDate,
      };
      return obj;
    }, {} as TimeSeriesData);
  }

  return keys
    .filter(key => {
      const keyDate = new Date(key);
      return keyDate >= fromDate && keyDate <= toDate;
    })
    .reduce((obj, key) => {
      const [year, month, day] = key.split('-');
      const transformedDate = `${day}.${month}.${year}`;
      obj[key] = {
        ...timeSeries[key],
        trade_date: transformedDate,
      };
      return obj;
    }, {} as TimeSeriesData);
}
