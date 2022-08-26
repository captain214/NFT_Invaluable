import React, { FC, Key, ReactComponentElement } from 'react';
import cn from 'classnames';
import { WithClassname } from '../../types/common/WithClassname';

import './table.style.scss';

interface ITableComposition {
  Row: FC<IRowProps & WithClassname>;
  Cell: FC<WithClassname>;
}

interface ITableProps {
  children: RowType | RowType[] | any[]; // TODO: figure out proper typings
}
interface IRowProps {
  isHeader?: boolean;
  children: CellType | CellType[];
}

type RowType = ReactComponentElement<typeof Row> | undefined;
type CellType = ReactComponentElement<typeof Cell> | undefined | false;

const Cell: FC<WithClassname> = (props) => <>{props.children}</>;
const Row: FC<IRowProps & WithClassname> = (props) => <>{props.children}</>;

const RenderCell = (cell: CellType, rowProps: IRowProps, key?: Key) => {
  if (!cell) return cell;
  const { children, className } = cell.props || {};
  return rowProps.isHeader ? (
    <th key={cell.key || `cell${key}`} className={className}>
      {children}
    </th>
  ) : (
    <td key={cell.key || `cell${key}`} className={className}>
      {children}
    </td>
  );
};
const RenderRow = (row: RowType, key?: Key) => {
  if (!row) return row;
  const children = ([] as CellType[]).concat(row.props?.children);
  const cells = children.map((item, i) => RenderCell(item, row.props, i));
  return (
    <tr key={row.key || `row${key}`} className={row.props?.className}>
      {cells}
    </tr>
  );
};

const Table: FC<ITableProps & WithClassname> & ITableComposition = (props) => {
  const children = ([] as RowType[]).concat(props.children).flat();
  const headRows = children.filter((i) => i?.props?.isHeader).map((item, i) => RenderRow(item, i));
  const bodyRows = children.filter((i) => !i?.props?.isHeader).map((item, i) => RenderRow(item, i));

  return (
    <table className={cn(props.className, 'streak-table')}>
      <thead>{headRows}</thead>
      <tbody>{bodyRows}</tbody>
    </table>
  );
};

Table.Row = Row;
Table.Cell = Cell;

export { Table };
