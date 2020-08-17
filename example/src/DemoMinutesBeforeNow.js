import React from 'react'
import { useState } from 'react'

import { TimeRange, TimeRangeBeforeNow } from '@jeanlazarou/react-time-range'

import { formatTime } from './utils'

export function DemoMinutesBeforeNow({ children }) {
  const [range, setRange] = useState({
    from: -60,
    to: -20
  })

  const rangeChanged = (range) => setRange(range)

  const { from, to } = range

  const duration = to - from

  return (
    <TimeRangeBeforeNow
      range={range}
      timespan={120}
      onChange={rangeChanged}
      style={{ width: 500, height: 80 }}
    >
      <TimeRange.Now>Now</TimeRange.Now>
      <TimeRange.Size>{formatTime(duration)}</TimeRange.Size>
      <TimeRange.Start>{formatTime(from)}</TimeRange.Start>
      <TimeRange.End>{formatTime(to)}</TimeRange.End>

      {children}
    </TimeRangeBeforeNow>
  )
}
