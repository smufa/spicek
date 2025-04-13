import {
  Line,
  LineChart,
  ReferenceArea,
  ReferenceDot,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Session } from '../../api/model';

type Props = { session: Session };

const remap = {
  FP: 'Filled pause', // e.g., "um", "uh"
  PW: 'Partial word', // e.g., word cutoffs
  RP: 'Repetition', // e.g., repeated phrases
  RV: 'Revision', // e.g., mid-sentence corrections
  RS: 'Restart', // e.g., abandoned sentences
};

const heightRemap = {
  FP: -20,
  PW: -10,
  RP: 0,
  RV: 10,
  RS: 20,
};

const colorMap = {
  FP: '#FF6B6B',
  PW: '#FF9E40',
  RP: '#4ECDC4',
  RV: '#45B7D1',
  RS: '#7768AE',
};

const postureColorMap: Record<string, string> = {
  Slouching: '#F7A072', // Orange-red
  'Arms Crossed': '#A288E3', // Purple
  'Hands Too Low': '#FFCB77', // Yellow
  'Looking Down': '#55CBCD', // Teal
  'Leaning Sideways': '#FF8882', // Coral
};

const postureHeightMap: Record<string, number> = {
  Slouching: -20,
  'Arms Crossed': -10,
  'Hands Too Low': 0,
  'Looking Down': 10,
  'Leaning Sideways': 20,
};

const remapType = (type: string) => {
  if (type in remap) {
    return remap[type as keyof typeof remap];
  }

  throw new Error(`Unknown type: ${type}`);
};

const remapHeight = (type: string) => {
  if (type in heightRemap) {
    return heightRemap[type as keyof typeof heightRemap];
  }

  throw new Error(`Unknown type: ${type}`);
};

const Chart = ({ session }: Props) => {
  const wpmData = session.fillerDto.wpm.map((d) => ({
    time: d.time,
    value: d.value,
  }));

  const maxTime = Math.max(...wpmData.map((d) => d.time));

  function getWPMAtTime(time: number) {
    const closest = wpmData.reduce((a, b) =>
      Math.abs(b.time - time) < Math.abs(a.time - time) ? b : a,
    );
    return closest.value;
  }

  const fillerEvents = Object.entries(session.fillerDto.disfluency).flatMap(
    ([type, events]) =>
      events.map((e) => ({
        type,
        fullType: remapType(type),
        height: remapHeight(type),
        start_ms: Math.min(e.start_ms, maxTime),
      })),
  );

  const badPostureEvents = session.postureData.map((p) => ({
    start_ms: p.startTime,
    end_ms: Math.min(p.endTime, maxTime),
    issue: p.issue,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={wpmData}
        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="time"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(value) =>
            `${Math.floor(value / 60000)}:${String(Math.floor((value % 60000) / 1000)).padStart(2, '0')}`
          }
          label={{
            value: 'Time (min:sec)',
            position: 'insideBottom',
            offset: -5,
          }}
        />
        <YAxis
          dataKey="value"
          label={{ value: 'WPM', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value) => [`${value} WPM`, 'Speech Rate']}
          labelFormatter={(value) =>
            `Time: ${Math.floor(value / 60000)}:${String(Math.floor((value % 60000) / 1000)).padStart(2, '0')}`
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />

        {/* Simple reference dots with labels */}
        {fillerEvents.map((event, index) => (
          <ReferenceDot
            key={index}
            x={event.start_ms}
            y={getWPMAtTime(event.start_ms) + event.height}
            r={10}
            fill={colorMap[event.type as keyof typeof colorMap] || '#888'}
            stroke="#fff"
            strokeWidth={1}
            isFront={true}
            label={{
              value: event.type,
              position: 'center',
              fill: '#fff',
              fontSize: 8,
              fontWeight: 'bold',
            }}
            ifOverflow="extendDomain"
          />
        ))}

        {/* Bad posture zones */}
        {badPostureEvents.map((event, index) => (
          <ReferenceArea
            key={index}
            y1={50 + postureHeightMap[event.issue] * 2}
            y2={50 + postureHeightMap[event.issue] * 2 + 20}
            x1={event.start_ms}
            x2={event.end_ms}
            strokeOpacity={0.3}
            fill={postureColorMap[event.issue] || '#FFA07A'}
            fillOpacity={0.2}
            label={{
              value: event.issue,
              position: 'insideTopRight',
              fontSize: 9,
              fill: '#555',
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
