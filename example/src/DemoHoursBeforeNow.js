import React from 'react'
import { useState } from 'react'

import { TimeRange, TimeRangeBeforeNow } from '@jeanlazarou/react-time-range'

import { humanizeHours } from './utils'

export function DemoHoursBeforeNow({ children, timespan, width, height }) {
  const style = {
    width: width ? width : 700,
    height: height ? height : 80
  }

  const [range, setRange] = useState({
    from: -9,
    to: -7
  })

  const rangeChanged = (range) => setRange(range)

  const { from, to } = range
  const hours = humanizeHours(from, to)

  return (
    <TimeRangeBeforeNow
      range={range}
      timespan={timespan}
      onChange={rangeChanged}
      style={style}
    >
      <TimeRange.Now>Now</TimeRange.Now>
      <TimeRange.Size>{hours}</TimeRange.Size>
      <TimeRange.Start>{`${from}h`}</TimeRange.Start>
      <TimeRange.End>{`${to}h`}</TimeRange.End>

      {children}
    </TimeRangeBeforeNow>
  )
}
