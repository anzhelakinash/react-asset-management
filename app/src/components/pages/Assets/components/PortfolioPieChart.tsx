import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Data structure for portfolio entries
interface PortfolioData {
  portfolio: string;
  amount: number;
}

interface PortfolioPieChartProps {
  data: PortfolioData[];
  title?: string;
}

// Color palette for the pie chart slices
const COLORS = [
  '#2E86AB', '#75B9BE', '#3B6978', '#204051', '#F6C90E',
  '#F08A5D', '#B83B5E', '#6A2C70', '#4E4E50', '#D6D5A8',
  '#63707D', '#A9BCD0',
];

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ data, title }) => {
  // Calculate total amount for percentage calculations
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // Configure Highcharts options for the pie chart
  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 260,
      animation: false,
      style: {
        fontFamily: 'Roboto, sans-serif',
      },
      spacing: [10, -5, 10, -10], // top, right, bottom, left
    },
    title: {
      text: title || '',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2E3B4E',
      },
    },
    tooltip: {
      // Custom tooltip formatter to show amount and percentage
      formatter: function () {
        // @ts-ignore
        const point = this.point as Highcharts.Point;
        // @ts-ignore
        const percentage = ((point.y / total) * 100).toFixed(2);
        // @ts-ignore
        return `<b>${point.name}</b><br/>Amount: $${point.y.toLocaleString()}<br/>Share: ${percentage}%`;
      },
      backgroundColor: '#FAFAFA',
      borderColor: '#D0D0D0',
      style: {
        color: '#1C2833',
        fontSize: '13px',
        fontFamily: 'monospace',
      },
    },
    plotOptions: {
      pie: {
        size: 200, 
        innerSize: '40%', // Creates a donut chart
        borderRadius: 0,
        borderWidth: 4,
        borderColor: '#ffffff',
        animation: false,
        dataLabels: {
          enabled: true,
          distance: 5,
          useHTML: true,        
          format: `<div class="custom-label"><span>{point.name}</span><br/><b>${'{point.y:,.0f}'}</b></div>`, 
          style: {
            allowOverlap: true,
            fontSize: '12px',
            fontWeight: '500',
            color: '#212F3D',
          },
        },
      },
    },

    legend: {
      enabled: true,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      itemStyle: {
        fontSize: '13px',
        color: '#34495E',
      },
      // Custom label formatter for the legend
      labelFormatter: function () {
        const point = this as Highcharts.Point;
        // @ts-ignore
        return `${point.name} — $${point.y.toLocaleString()}`;
      },
    },
    series: [
      {
        name: 'Capital',
        type: 'pie',
        // Map data to pie chart format with colors
        data: data.map((item, index) => ({
          name: item.portfolio,
          y: item.amount,
          color: COLORS[index % COLORS.length], // Cycle through colors if more items than colors
        })),
      },
    ],
    credits: { enabled: false },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PortfolioPieChart;
