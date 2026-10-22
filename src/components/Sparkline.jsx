import { memo } from 'react';
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, YAxis } from 'recharts';

/** Axis-less 30-day price preview with a dashed 30-day-average reference line. */
const Sparkline = memo(function Sparkline({ data, avg, id, color = '#94a3b8', height = 32 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        {avg != null && <ReferenceLine y={avg} stroke="#cbd5e1" strokeDasharray="2 3" />}
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${id})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});

export default Sparkline;
