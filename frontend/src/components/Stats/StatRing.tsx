import {
  Group,
  MantineColor,
  Paper,
  RingProgress,
  SimpleGrid,
  Text,
} from '@mantine/core';

export interface StatProps {
  label: string;
  stats: string;
  color: MantineColor;
  progress?: number;
  icon?: React.ReactNode;
}

export function StatsRing({ data }: { data: StatProps[] }) {
  const stats = data.map((stat) => {
    const Icon = stat.icon;
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group>
          {stat.progress != undefined ? (
            <RingProgress
              size={40}
              roundCaps
              thickness={6}
              sections={[{ value: stat.progress, color: stat.color }]}
              // label={<Center>{Icon}</Center>}
            />
          ) : (
            Icon && Icon
          )}

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {stat.label}
            </Text>
            <Text fw={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>;
}
