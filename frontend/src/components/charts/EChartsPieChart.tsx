import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { chartChrome, seriesPalette } from '../../theme/palette';

interface Props {
  data: { label: string; value: number }[];
  donut?: boolean;
}

export function EChartsPieChart({ data, donut = false }: Props) {
  const option = useMemo(() => {
    const chrome = chartChrome();
    const palette = seriesPalette();
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return {
      color: palette,
      textStyle: { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
      tooltip: {
        trigger: 'item',
        backgroundColor: chrome.surface,
        borderColor: chrome.gridline,
        textStyle: { color: chrome.textPrimary },
        formatter: (params: { name: string; value: number; percent: number }) =>
          `<b>${params.name}</b>: ${params.value.toLocaleString('en-IN')} (${params.percent}%)`,
      },
      legend: {
        show: data.length >= 2,
        bottom: 0,
        left: 'center',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: chrome.textSecondary, fontSize: 11 },
      },
      series: [
        {
          type: 'pie',
          radius: donut ? ['45%', '72%'] : '72%',
          center: ['50%', '44%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: chrome.surface,
            borderWidth: 2,
            borderRadius: 3,
          },
          label: {
            show: true,
            formatter: (p: { name: string; value: number }) => `${p.name}\n${p.value.toLocaleString('en-IN')}`,
            color: chrome.textSecondary,
            fontSize: 10.5,
          },
          labelLine: { lineStyle: { color: chrome.baseline } },
          data: data.map((d) => ({ name: d.label, value: d.value })),
        },
      ],
      graphic: donut
        ? [
            {
              type: 'text',
              left: 'center',
              top: '38%',
              style: {
                text: total.toLocaleString('en-IN'),
                fontSize: 20,
                fontWeight: 700,
                fill: chrome.textPrimary,
              },
            },
          ]
        : [],
    };
  }, [data, donut]);

  return <ReactECharts option={option} style={{ height: 260 }} notMerge />;
}
