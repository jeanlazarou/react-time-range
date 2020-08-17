export const sourceCodeBefore = {
  '10hours': `export default () => {
  const [range, setRange] = useState({
    from: -9,
    to: -7
  });
  const rangeChanged = (range) => setRange(range);
  return (
    <TimeRangeBeforeNow
      range={range}
      timespan={10}
      onChange={(x) => rangeChanged(x)}
      style={{ width: 700, height: 80 }}
    >
      <TimeRange.Now>Now</TimeRange.Now>
      <TimeRange.Size>{humanizeHours(range.from, range.to)}</TimeRange.Size>
      <TimeRange.Start>{\`\${range.from}h\`}</TimeRange.Start>
      <TimeRange.End>{\`\${range.to}h\`}</TimeRange.End>

      <TimeRange.Ticks every={1} />
    </TimeRangeBeforeNow>
  )
}
`,
  '24hours': `export default () => {
  const [range, setRange] = useState({
    from: -9,
    to: -7
  });
  const rangeChanged = (range) => setRange(range);
  return (
    <TimeRangeBeforeNow
      range={range}
      timespan={24}
      onChange={(x) => rangeChanged(x)}
      style={{ width: 700, height: 80 }}
    >
      <TimeRange.Now>Now</TimeRange.Now>
      <TimeRange.Size>{humanizeHours(range.from, range.to)}</TimeRange.Size>
      <TimeRange.Start>{\`\${range.from}h\`}</TimeRange.Start>
      <TimeRange.End>{\`\${range.to}h\`}</TimeRange.End>

      <TimeRange.Ticks />
    </TimeRangeBeforeNow>
  )
}
`,
  '120minutes': `export default () => {
  const [range, setRange] = useState({
    from: -60,
    to: -20
  });
  const rangeChanged = (range) => setRange(range);
  return (
    <TimeRangeBeforeNow
      range={range}
      timespan={120}
      onChange={(x) => rangeChanged(x)}
      style={{ width: 500, height: 80 }}
    >
      <TimeRange.Now>Now</TimeRange.Now>
      <TimeRange.Size>{formatTime(range.to - range.from)}</TimeRange.Size>
      <TimeRange.Start>{formatTime(range.from)}</TimeRange.Start>
      <TimeRange.End>{formatTime(range.to)}</TimeRange.End>
    </TimeRangeBeforeNow>
  )
}
`,
  '120minutes-ticks': `export default () => {
  const [range, setRange] = useState({
    from: -60,
    to: -20
  });
  const rangeChanged = (range) => setRange(range);
  return (
    <TimeRangeBeforeNow
      range={range}
      timespan={120}
      onChange={(x) => rangeChanged(x)}
      style={{ width: 500, height: 80 }}
    >
      <TimeRange.Now>Now</TimeRange.Now>
      <TimeRange.Size>{formatTime(range.to - range.from)}</TimeRange.Size>
      <TimeRange.Start>{formatTime(range.from)}</TimeRange.Start>
      <TimeRange.End>{formatTime(range.to)}</TimeRange.End>

      <TimeRange.Ticks every={10} />
    </TimeRangeBeforeNow>
  )
}
`
}

export const sourceCodeAfter = {
  '24hours': `export default () => {
  const [range, setRange] = useState({
    from: -11,
    to: 6
  });
  const rangeChanged = (range) => setRange(range);
  return (
    <TimeRangeAt
      range={range}
      spanAfter={12}
      spanBefore={24}
      onChange={rangeChanged}
      style={{ width: 500, height: 80 }}
    >
      <TimeRange.At>13:14</TimeRange.At>
      <TimeRange.Size>{humanizeHours(range.from, range.to)}</TimeRange.Size>
      <TimeRange.Start>{\`\${range.from}h\`}</TimeRange.Start>
      <TimeRange.End>{\`\${range.to}h\`}</TimeRange.End>

      <TimeRange.Ticks every={1} />
    </TimeRangeAt>
  )
}
`,
  '12hours': `export default () => {
  const [range, setRange] = useState({
    from: -11,
    to: 6
  });
  const rangeChanged = (range) => setRange(range);
  return (
    <TimeRangeAt
      range={range}
      spanAfter={12}
      spanBefore={12}
      onChange={rangeChanged}
      style={{ width: 500, height: 80 }}
    >
      <TimeRange.At>17:21</TimeRange.At>
      <TimeRange.Size>{humanizeHours(range.from, range.to)}</TimeRange.Size>
      <TimeRange.Start>{\`\${range.from}h\`}</TimeRange.Start>
      <TimeRange.End>{\`\${range.to}h\`}</TimeRange.End>

      <TimeRange.Ticks every={1} />
    </TimeRangeAt>
  )
}
`,
  '15hours': `export default () => {
  const [range, setRange] = useState({
    from: -11,
    to: 6
  });
  const rangeChanged = (range) => setRange(range);
  return (
    <TimeRangeAt
      range={range}
      spanAfter={7}
      spanBefore={15}
      onChange={rangeChanged}
      style={{ width: 500, height: 80 }}
    >
      <TimeRange.At>0:17</TimeRange.At>
      <TimeRange.Size>{humanizeHours(range.from, range.to)}</TimeRange.Size>
      <TimeRange.Start>{\`\${range.from}h\`}</TimeRange.Start>
      <TimeRange.End>{\`\${range.to}h\`}</TimeRange.End>

      <TimeRange.Ticks every={1} />
    </TimeRangeAt>
  )
}
`
}
