# @jeanlazarou/react-time-range

> A time range component

[![NPM](https://img.shields.io/npm/v/@jeanlazarou/react-time-range.svg)](https://www.npmjs.com/package/@jeanlazarou/react-time-range) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

https://jeanlazarou.github.io/react-time-range/

## Install

```bash
yarn add @jeanlazarou/react-time-range
```

## Usage

```jsx
import React, { useState } from 'react'

import { TimeRange, TimeRangeBeforeNow } from "@jeanlazarou/react-time-range";

import '@jeanlazarou/react-time-range/dist/index.css'

function Example() {
  const [range, setRange] = useState({
    from: -9,
    to: -7
  });

  const rangeChanged = (range) => setRange(range);

  const humanizeHours = (from, to) => {
    const hours = to - from;

    return hours === 1 ? `1 hour` : `${hours} hours`;
  }

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
```

## Development notes

The component was build and deployed using [create-react-library](https://github.com/transitive-bullshit/create-react-library), following next article [How to publish a custom React component to NPM using Create React Library](https://dev.to/ramonak/how-to-publish-a-custom-react-component-to-npm-using-create-react-library-4bhi).

## License

MIT © [jeanlazarou](https://github.com/jeanlazarou)
