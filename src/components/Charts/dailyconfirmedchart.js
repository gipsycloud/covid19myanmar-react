import {
  defaultOptions,
  xAxisDefaults,
  yAxisDefaults,
  formatNumber,
} from './chart-defaults';

import {format, parse} from 'date-fns';
import deepmerge from 'deepmerge';
import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';
import {useTranslation} from 'react-i18next';

function DailyConfirmedChart(props) {
  const {t} = useTranslation();
  const dates = [];
  const confirmed = [];
  const recovered = [];
  const deceased = [];

  if (!props.timeseries || props.timeseries.length === 0) {
    return <div></div>;
  }

  props.timeseries.forEach((data, index) => {
    if (index >= 31) {
      const date = parse(data.date, 'dd/MM/yyyy', new Date());
      dates.push(format(date, 'dd MMM'));
      confirmed.push(data.dailyconfirmed);
      recovered.push(data.dailyrecovered);
      deceased.push(data.dailydeceased);
    }
  });

  const barDataSet = {
    labels: dates,
    datasets: [
      {
        data: recovered,
        label: t('recovered.full'),
        backgroundColor: '#7ebf80',
      },
      {
        data: deceased,
        label: t('deceased.full'),
        backgroundColor: '#6c757d',
      },
      {
        data: confirmed,
        label: t('confirmed.full'),
        backgroundColor: '#ff6862',
      },
    ],
  };

  const options = deepmerge(defaultOptions, {
    tooltips: {
      mode: 'index',
    },
    legend: {
      display: true,
      reverse: true,
      labels: {
        usePointStyle: true, // Required to change pointstyle to 'rectRounded' from 'circle'
        generateLabels: (chart) => {
          const labels = defaults.global.legend.labels.generateLabels(chart);
          labels.forEach((label) => {
            label.pointStyle = 'rectRounded';
          });
          return labels;
        },
      },
    },
    scales: {
      xAxes: [
        deepmerge(xAxisDefaults, {
          stacked: true,
        }),
      ],
      yAxes: [
        deepmerge(yAxisDefaults, {
          stacked: true,
          ticks: {
            callback: (value) => formatNumber(value),
          },
        }),
      ],
    },
  });

  return (
    <div className="charts-header">
      <div className="chart-title">{props.title}</div>
      <div className="chart-content">
        <Bar data={barDataSet} options={options} />
      </div>
    </div>
  );
}

export default DailyConfirmedChart;
