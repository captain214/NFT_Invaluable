import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import './item-price-history.style.scss';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { format } from 'date-fns';

import { WithClassname } from '../../../../types/common/WithClassname';
import { DAY } from '../../../../../utils/time-utils';
import { normalizeEthPrice } from '../../../../../utils/eth-utils';
import { Dropdown, ISuggestion } from '../../../../components/dropdown/dropdown.component';

interface IProps {
  events?: any[];
  onFilterChange?: (id: EPriceHistoryFilter) => unknown;
}

export enum EPriceHistoryFilter {
  AllTime = 0,
  Days7 = 7,
  Days14 = 14,
  Days30 = 30,
  Days60 = 60,
  Days90 = 90,
  Year = 365
}

export const ItemPriceHistory: FC<IProps & WithClassname> = (props) => {
  const { events = [], onFilterChange = () => {} } = props;

  const graphData = events
    .filter((i) => i.type === 'TRANSFER')
    .map((i) => ({
      date: new Date(i.created_at).getTime(),
      price: normalizeEthPrice(i.price)
    }))
    .sort((a, b) => a.date - b.date);

  const xTickFormatter = (value: number) => {
    return format(value, 'd/MM');
  };

  const getDataBounds = useCallback(() => {
    return {
      min: graphData.reduce((prev, curr) => (prev.date < curr.date ? prev : curr)),
      max: graphData.reduce((prev, curr) => (prev.date > curr.date ? prev : curr))
    };
  }, [graphData]);

  const createDateTicks = useCallback((min: number, max: number, maxTicks = 8) => {
    const diff = max - min;
    const diffDays = Math.ceil(diff / DAY);
    const amountOfTicks = Math.min(diffDays, maxTicks);
    const output = new Array(amountOfTicks).fill(undefined);
    if (amountOfTicks <= 1) {
      return [min + diff / 2];
    }
    return output.map((_, index) =>
      Math.round(min + (diff / Math.max(amountOfTicks - 1, 1)) * index)
    );
  }, []);

  const tooltipFormatter = (value: any): string[] => {
    return [value, 'Price'];
  };

  const getYTickAmount = (maxPrice: number) => {
    const amountCandidates = [5, 4, 3, 2];
    const lengthAfterDot = amountCandidates.map((i) => {
      const divided = (maxPrice * 1000) / i / 1000;
      return Number(String(divided).split('.')[1]) || 0;
    });
    const minLength = Math.min(...lengthAfterDot);
    return amountCandidates[lengthAfterDot.indexOf(minLength)] + 1;
  };

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-text">{format(payload[0].payload.date, 'LLL d yyyy')}</p>
          <p className="tooltip-text">Price: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const handleDropdownChange = (value: ISuggestion<EPriceHistoryFilter>) => {
    onFilterChange(value.id);
  };

  const filterFields: ISuggestion<EPriceHistoryFilter>[] = [
    { id: EPriceHistoryFilter.AllTime, value: 'All time' },
    { id: EPriceHistoryFilter.Days7, value: 'Last 7 days' },
    { id: EPriceHistoryFilter.Days14, value: 'Last 14 days' },
    { id: EPriceHistoryFilter.Days30, value: 'Last 30 days' },
    { id: EPriceHistoryFilter.Days60, value: 'Last 60 days' },
    { id: EPriceHistoryFilter.Days90, value: 'Last 90 days' },
    { id: EPriceHistoryFilter.Year, value: 'Last year' }
  ];

  if (graphData.length === 0) {
    return (
      <div className={cn('item-price-history-root')}>
        <Dropdown
          className="filter"
          size="small"
          filledColor="#201C21"
          suggestions={filterFields}
          defaultValue={filterFields[0]}
          onChange={handleDropdownChange}
        />
        <div className="no-data">No trading data yet</div>
      </div>
    );
  }

  const { min, max } = getDataBounds();
  const maxY = Math.ceil(Number(max.price) * 10) / 10;
  const yDomain = [0, maxY];
  const dateTicks = createDateTicks(min.date, max.date);

  return (
    <div className={cn('item-price-history-root')}>
      <Dropdown
        className="filter"
        size="small"
        filledColor="#201C21"
        suggestions={filterFields}
        defaultValue={filterFields[0]}
        onChange={handleDropdownChange}
      />
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          height={250}
          data={graphData}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#4925E9" />
              <stop offset="50%" stopColor="#7BF1F5" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#424247" vertical={false} />
          <XAxis
            domain={[`dataMin`, `dataMax`]}
            dataKey="date"
            type="number"
            interval="preserveStartEnd"
            tickFormatter={xTickFormatter}
            ticks={dateTicks}
            tickMargin={10}
            padding={{ left: 5, right: 5 }}
          />
          <YAxis tickCount={getYTickAmount(maxY)} domain={yDomain} />
          <Tooltip formatter={tooltipFormatter} content={renderTooltip} />
          <Line
            dot={false}
            type="monotone"
            strokeWidth={3}
            dataKey="price"
            stroke="url(#gradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
