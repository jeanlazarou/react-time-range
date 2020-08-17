import React from 'react'
import { useState } from 'react'

import { TimeRange, TimeRangeAt } from '@jeanlazarou/react-time-range'

import { humanizeHours } from './utils'

export function DemoHoursAtMoment({ at, children, spanBefore, spanAfter }) {
  const [range, setRange] = useState({
    from: -11,
    to: 6
  })

  const rangeChanged = (range) => setRange(range)

  const { from, to } = range

  const hours = humanizeHours(from, to)

  return (
    <TimeRangeAt
      range={range}
      spanAfter={spanAfter}
      spanBefore={spanBefore}
      onChange={rangeChanged}
      style={{ width: 500, height: 80 }}
    >
      <TimeRange.At>{at}</TimeRange.At>
      <TimeRange.Size>{hours}</TimeRange.Size>
      <TimeRange.Start>{`${from}h`}</TimeRange.Start>
      <TimeRange.End>{`${to}h`}</TimeRange.End>

      {children}
    </TimeRangeAt>
  )
}
