import React from 'react';
import {
    TableWrapper,
    StyledTable,
    TableHead,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
} from './Table.styles';

interface TableProps {
    children: React.ReactNode;
}

interface TableSubComponents {
    Header: typeof TableHead;
    Body: typeof TableBody;
    Row: typeof TableRow;
    Head: typeof TableHeader;
    Cell: typeof TableCell;
}

export const Table: React.FC<TableProps> & TableSubComponents = ({ children }) => {
    return (
        <TableWrapper>
            <StyledTable>{children}</StyledTable>
        </TableWrapper>
    );
};

Table.Header = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHeader;
Table.Cell = TableCell;