import { Table } from '@mantine/core';

import { MonthlyData } from '../../../hooks/useMonthlyData';

export const MonthlyTable = ({ data }: { data: MonthlyData }) => {
  const elements = [{ position: 1, name: 'Hydrogen', symbol: 'H', mass: 1.0079 }];

  const ths = (
    <tr>
      <th>Godziny</th>
      <th>Task</th>
      <th>Notatka</th>
      <th>Akcje</th>
    </tr>
  );
  const rows = elements.map((element: any) => (
    <tr key={element.name}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
    </tr>
  ));

  return (
    <Table verticalSpacing="sm" highlightOnHover>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
