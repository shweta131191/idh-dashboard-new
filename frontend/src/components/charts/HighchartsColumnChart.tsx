import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { chartChrome, seriesPalette } from '../../theme/palette';

interface Props {
  data: { label: string; value: number }[];
}

export function HighchartsColumnChart({ data }: Props) {
  const options = useMemo<Highcharts.Options>(() => {
    const chrome = chartChrome();
    const palette = seriesPalette();

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: 220,
        style: { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: data.map((d) => d.label),
        lineColor: chrome.baseline,
        tickColor: chrome.baseline,
        labels: { style: { color: chrome.textSecondary, fontSize: '11px' } },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: chrome.gridline,
        labels: { style: { color: chrome.textMuted, fontSize: '11px' } },
      },
      legend: { enabled: false },
      tooltip: {
        backgroundColor: chrome.surface,
        borderColor: chrome.gridline,
        style: { color: chrome.textPrimary },
        formatter() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const point = this as any;
          return `<b>${point.x}</b>: ${Highcharts.numberFormat(point.y, 0)}`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          borderWidth: 0,
          pointPadding: 0.08,
          groupPadding: 0.08,
          colorByPoint: true,
          colors: palette,
          dataLabels: {
            enabled: true,
            style: { color: chrome.textSecondary, fontSize: '10.5px', textOutline: 'none' },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Count',
          data: data.map((d) => d.value),
          dataLabels: { enabled: true },
        },
      ],
    };
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
