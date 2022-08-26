import React, { FC, useState } from 'react';
import './item-trading-history.styles.scss';

import { Dropdown, ISuggestion } from '../../../../components/dropdown/dropdown.component';
import { Table } from '../../../../components/table/table.component';
import { ItemTradingHistoryRow } from '../item-trading-history-row/item-trading-history-row.component';
import { TokenType } from '../../../../../constants/token-type.enum';

interface IProps {
  events?: any[];
  type: string;
}

export const ItemTradingHistory: FC<IProps> = (props) => {
  const [filter, setFilter] = useState<string>();

  const suggestions = [
    { id: '', value: 'All' },
    { id: 'OFFER', value: 'Offer' },
    { id: 'UNLIST', value: 'Cancel' },
    { id: 'TRANSFER', value: 'Sold' },
    { id: 'CREATE', value: 'Create' }
  ];

  const handleFilterChange = (value: ISuggestion) => setFilter(value.id);

  const pipeEvents =
    props.events &&
    props.events
      .filter((i) => i.type === filter || !filter)
      .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());

  return (
    <div className="item-trading-history-root">
      <div className="filter-container">
        <Dropdown
          className="filter"
          size="small"
          defaultValue={suggestions[0]}
          suggestions={suggestions}
          placeholder="Filter"
          onChange={handleFilterChange}
          filledColor="#201C21"
        />
      </div>
      <Table className="table">
        {props.type === TokenType.ERC1155 ? (
          <Table.Row isHeader className="table-header">
            <Table.Cell>Event</Table.Cell>
            <Table.Cell>Unit Price</Table.Cell>
            <Table.Cell>Quantity</Table.Cell>
            <Table.Cell>From</Table.Cell>
            <Table.Cell>To</Table.Cell>
            <Table.Cell>Date</Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row isHeader className="table-header">
            <Table.Cell>Event</Table.Cell>
            <Table.Cell>Price</Table.Cell>
            <Table.Cell>From</Table.Cell>
            <Table.Cell>To</Table.Cell>
            <Table.Cell>Date</Table.Cell>
          </Table.Row>
        )}
        {pipeEvents?.map((event) => ItemTradingHistoryRow({ event, type: props.type }))}
      </Table>
    </div>
  );
};
