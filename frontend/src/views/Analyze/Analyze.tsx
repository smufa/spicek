import { Group, Paper, Slider, Stack } from '@mantine/core';
import { LineChart } from '@mantine/charts';

const data = [
  {
    date: 'Mar 22',
    Apples: 2890,
    Oranges: 2338,
    Tomatoes: 2452,
  },
  {
    date: 'Mar 23',
    Apples: 2756,
    Oranges: 2103,
    Tomatoes: 2402,
  },
  {
    date: 'Mar 24',
    Apples: 3322,
    Oranges: 986,
    Tomatoes: 1821,
  },
  {
    date: 'Mar 25',
    Apples: 3470,
    Oranges: 2108,
    Tomatoes: 2809,
  },
  {
    date: 'Mar 26',
    Apples: 3129,
    Oranges: 1726,
    Tomatoes: 2290,
  },
];

export const Analyze = () => {
  return (
    <Stack h="100%" bg="grape" p="md" m="0">
      <Group w="100%" h="100%" gap="xl">
        <Paper flex={8} h="100%">
          Video
        </Paper>
        <Paper flex={4} h="100%">
          Text
        </Paper>
      </Group>
      <Group w="100%" gap="xl">
        <Paper w="100%">
          <Slider w="100%" />
          <LineChart
            w="100%"
            h={200}
            data={data}
            withYAxis={false}
            dataKey="date"
            series={[
              { name: 'Apples', color: 'indigo.6' },
              { name: 'Oranges', color: 'blue.6' },
              { name: 'Tomatoes', color: 'teal.6' },
            ]}
            curveType="linear"
          />
        </Paper>
      </Group>
    </Stack>
  );
};
