import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Interface for performance data points
interface PerformancePoint {
  date: string;
  value: number;
  quantity?: number;
  pricePerItem?: number;
}

// Props for the performance chart component
interface PerformanceChartProps {
  title?: string;
  portfolioPerformance: PerformancePoint[];
  benchmarkData: PerformancePoint[];
}

export function PerformanceChart({
  title,
  portfolioPerformance,
  benchmarkData,
}: PerformanceChartProps) {
  // Get starting values for normalization
  const portfolioStart = portfolioPerformance[0]?.value || 1;
  const benchmarkStart = benchmarkData[0]?.value || 1;

  // Format portfolio data for Highcharts
  const portfolioSeries = portfolioPerformance.map((p) => ({
    x: new Date(p.date).getTime(),
    y: p.value,
    custom: {
      quantity: p.quantity,
      pricePerItem: p.pricePerItem,
    },
  }));

  // Format benchmark data for Highcharts, normalizing to same starting point as portfolio
  const benchmarkSeries = benchmarkData.map((b, ) => ({
    x: new Date(b.date).getTime(),
    y: (b.value * portfolioStart) / benchmarkStart, // Scale benchmark to match portfolio starting point
    custom: {
      quantity: b.quantity,
      pricePerItem: b.pricePerItem,
    },
  }));

  // Configure Highcharts options
  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      height: 400,
    },
    title: {
      text: title || 'Portfolio vs Benchmark Performance',
    },
    xAxis: {
      type: 'datetime',
      title: { text: 'Date' },
    },
    yAxis: {
      title: { text: 'Value (USD)' },
    },
    tooltip: {
      shared: true,
      // Custom tooltip formatter to show detailed information
      formatter: function () {
        const points = this.points || [];
        const headerDate = Highcharts.dateFormat('%Y-%m-%d', this.x as number);
        const lines = [`<b>${headerDate}</b><br/><br/>`]; // ← spacing after header

        points.forEach((p, idx) => {
          // @ts-ignore
          const { quantity, pricePerItem, date } = (p.point as any).custom || {};
          lines.push(
            `<span style="color:${p.color}">\u25CF</span> <b>${p.series.name}</b>: $${p.y?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          );
          if (quantity !== undefined) {
            lines.push(`<br/>Quantity: ${quantity}`);
          }
          if (pricePerItem !== undefined) {
            lines.push(
              `<br/>Price per Item: $${pricePerItem.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            );
          }
          if (date) {
            lines.push(`<br/>Trade Date: ${date}`);
          }

          if (idx < points.length - 1) {
            lines.push('<br/><br/>');  // ← spacing between series
          }
        });

        return lines.join('');
      },
    },
    series: [
      {
        name: 'Portfolio',
        type: 'line',
        data: portfolioSeries,
        color: '#2E86AB',
      },
      {
        name: 'Benchmark (MSCI World ETF)',
        type: 'line',
        data: benchmarkSeries,
        color: '#F08A5D',
      },
    ],
    credits: { enabled: false },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default PerformanceChart;
