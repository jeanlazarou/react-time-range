import React from 'react'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'

function PositionHandle({ x, y = 45, fixed, children, onMouseDown }) {
  const styleClass = 'rtr-position-handle' + (fixed ? '' : ' rtr-range-resize')

  return (
    <React.Fragment>
      <rect
        x={x}
        y='20'
        width={1}
        height='25'
        className={styleClass}
        onMouseDown={onMouseDown}
      />
      <text
        x={x}
        y={y}
        className='rtr-at-text'
        dominantBaseline='hanging'
        lengthAdjust='spacingAndGlyphs'
        textAnchor='middle'
      >
        {children}
      </text>
    </React.Fragment>
  )
}

function RangeHandle({
  x,
  width,
  fixed,
  children,
  onDoubleClick,
  onMouseDown
}) {
  return (
    <React.Fragment>
      <rect
        className='rtr-range rtr-range-draggable'
        x={x}
        y='20'
        width={width}
        height='20'
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
      />
      <text
        x={x + width / 2}
        y='8'
        className='rtr-range-text'
        dominantBaseline='hanging'
        lengthAdjust='spacingAndGlyphs'
        textAnchor='middle'
      >
        {children}
      </text>
    </React.Fragment>
  )
}

function Ticks({ x: x0, y, width, every, n }) {
  if (width === 0) return null

  const ticks = new Array(n + 1).fill(0).reduce((acc, _m, i) => {
    if (i % every !== 0) return acc

    const x = x0 + i * width

    acc.push(
      <line key={i} x1={x} x2={x} y1={y} y2={y + 5} className='rtr-ticks' />
    )

    return acc
  }, [])

  return <React.Fragment>{ticks}</React.Fragment>
}

const END = Symbol('end')
const START = Symbol('start')
const WINDOW = Symbol('window')

const AROUND_AT = Symbol('around-at')
const BEFORE_NOW = Symbol('before-now')

const ORIGIN = 20

function TimeRangeAt({
  children,
  onChange,
  spanBefore,
  spanAfter,
  style,
  range
}) {
  const timespan = spanBefore + spanAfter

  const behaviorCreator = useMemo(
    () => (maxX) => {
      const xToValuesAt = (origin, startX, endX, width, timespan) => {
        width -= origin

        const fromRight = Math.round(((startX - width) / width) * timespan)
        const from = fromRight + spanAfter
        const duration = Math.round(((endX - startX) * timespan) / width)

        return { from, to: from + duration }
      }

      const behavior = {
        type: () => AROUND_AT,
        init: (step, width, setAtX, setStartX, setEndX) => {
          const sizeBefore = ((width - ORIGIN) / timespan) * spanBefore

          setAtX(ORIGIN + sizeBefore)

          setStartX(ORIGIN + sizeBefore + range.from * step)
          setEndX(ORIGIN + sizeBefore + range.to * step)
        },
        xToValues: xToValuesAt,
        childToText: (child, texts, atX, startX, endX) => {},
        rejectStartMove: (x, atX, startX, endX) => x < ORIGIN || x > atX,
        rejectEndMove: (x, atX, startX, endX) => x > maxX || x < atX,
        rejectRangeMove: (x1, x2, atX, startX, endX) => x1 > atX || x2 < atX
      }

      return behavior
    },
    [timespan, range.from, range.to, spanBefore, spanAfter]
  )

  return useTimeRange({
    behaviorCreator,
    children,
    onChange,
    timespan,
    style,
    range
  })
}

TimeRangeAt.propTypes = {
  spanBefore: PropTypes.number.isRequired,
  spanAfter: PropTypes.number.isRequired,
  range: PropTypes.shape({
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
  }).isRequired,
  onChange: PropTypes.func,
  style: PropTypes.object
}

function TimeRangeBeforeNow({ children, onChange, timespan, style, range }) {
  const xToValuesBack = (origin, startX, endX, width, timespan) => {
    width -= origin

    const from = Math.round(((startX - width) / width) * timespan)
    const duration = Math.round(((endX - startX) * timespan) / width)

    return { from, to: from + duration }
  }

  const behaviorCreator = useMemo(
    () => (maxX) => {
      const behavior = {
        type: () => BEFORE_NOW,
        init: (step, width, setAtX, setStartX, setEndX) => {
          setStartX(ORIGIN + (timespan + range.from) * step)
          setEndX(ORIGIN + (timespan + range.to) * step)
        },
        xToValues: xToValuesBack,
        childToText: (child, texts, atX, startX, endX) => {
          if (child.type === TimeRange.End) {
            texts.end = endX === maxX ? '' : child.props.children
          }
        },
        rejectStartMove: (x, atX, startX, endX) => x < ORIGIN || x > endX,
        rejectEndMove: (x, atX, startX, endX) => x > maxX || x < startX,
        rejectRangeMove: (x1, x2, atX, startX, endX) => false
      }

      return behavior
    },
    [timespan, range.from, range.to]
  )

  return useTimeRange({
    behaviorCreator,
    children,
    onChange,
    timespan,
    style,
    range
  })
}

TimeRangeBeforeNow.propTypes = {
  timespan: PropTypes.number.isRequired,
  range: PropTypes.shape({
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
  }).isRequired,
  onChange: PropTypes.func,
  style: PropTypes.object
}

let count = 0
function useTimeRange({
  behaviorCreator,
  children,
  onChange,
  timespan,
  style,
  range
}) {
  const [dragging, setDrag] = useState(undefined)
  const [didMove, setMoved] = useState(false)
  const [startX, setStartX] = useState(30)
  const [endX, setEndX] = useState(10)
  const [maxX, setMaxX] = useState(0)
  const [atX, setAtX] = useState(0)

  const [previous, setPrevious] = useState(null)

  const [step, setStep] = useState(0)

  const [svg, setSVG] = useState(null)

  const behavior = behaviorCreator(maxX)

  const onResize = (width) => {
    const newStep = (width - ORIGIN) / timespan

    setStep(newStep)
    setMaxX(width)

    behavior.init(newStep, width, setAtX, setStartX, setEndX)

    setPrevious(null)
  }

  useEffect(() => {
    if (!svg) return

    let previousWidth = undefined

    const ro = new ResizeObserver((entries) => {
      const width = svg.getBoundingClientRect().width - ORIGIN

      if (previousWidth !== width) onResize(width)

      previousWidth = width
    })

    ro.observe(svg)

    return () => ro.unobserve(svg)
  }, [svg, timespan])

  const notifyChange = !onChange
    ? () => {}
    : (startX, endX, maxX, timespan) =>
        onChange(behavior.xToValues(ORIGIN, startX, endX, maxX, timespan))

  const state = {
    svg,
    dragging,
    didMove,
    step,
    atX,
    startX,
    endX,
    timespan,
    maxX
  }

  const setters = {
    setStartX,
    setEndX,
    setDrag,
    setMoved,
    setPrevious
  }

  const { texts, ticksFrequency } = processChildren(children, behavior, state)

  const mouseMove = (ev) => {
    mouseMoveHandler(ev, behavior, state, setters, notifyChange)
  }

  const mouseUp = (ev) => {
    mouseUpHandler(state, setters, notifyChange)
  }

  return (
    <svg
      ref={(node) => setSVG(node)}
      style={style}
      onMouseMove={mouseMove}
      onMouseLeave={mouseUp}
      onMouseUp={mouseUp}
    >
      <line x1={ORIGIN} y1='30' x2={maxX} y2='30' className='rtr-timeline' />
      <RangeHandle
        x={startX}
        width={endX - startX}
        onMouseDown={() => setDrag(WINDOW)}
        onDoubleClick={() => {
          if (previous) {
            setPrevious(null)
          } else {
            setPrevious({ x1: startX, x2: endX })
          }

          const x1 = previous ? previous.x1 : ORIGIN
          const x2 = previous ? previous.x2 : maxX

          setStartX(x1)
          setEndX(x2)

          notifyChange(x1 - ORIGIN, x2 - ORIGIN, maxX, timespan)
        }}
      >
        {texts.size}
      </RangeHandle>

      {behavior.type() === BEFORE_NOW ? (
        <PositionHandle x={maxX} fixed>
          {texts.now}
        </PositionHandle>
      ) : (
        <PositionHandle x={atX} y={58} fixed>
          {texts.at}
        </PositionHandle>
      )}

      <PositionHandle x={startX - 1} onMouseDown={() => setDrag(START)}>
        {texts.start}
      </PositionHandle>
      <PositionHandle x={endX} onMouseDown={() => setDrag(END)}>
        {texts.end}
      </PositionHandle>

      {ticksFrequency ? (
        <Ticks
          x={ORIGIN}
          y={30}
          width={step}
          n={timespan}
          every={ticksFrequency}
        />
      ) : null}
    </svg>
  )
}

function processChildren(children, behavior, state) {
  const { atX, startX, endX } = state

  const texts = {}

  let ticksFrequency = null

  React.Children.map(children, (child) => {
    if (!child) return

    if (child.type === TimeRange.Now) {
      texts.now = child.props.children
    } else if (child.type === TimeRange.At) {
      texts.at = child.props.children
    } else if (child.type === TimeRange.Start) {
      texts.start = child.props.children
    } else if (child.type === TimeRange.End) {
      texts.end = child.props.children
    } else if (child.type === TimeRange.Size) {
      texts.size = child.props.children
    } else if (child.type === TimeRange.Ticks) {
      ticksFrequency = child.props.every ? child.props.every : 1
    }

    behavior.childToText(child, texts, atX, startX, endX)
  })

  return { texts, ticksFrequency }
}

function mouseMoveHandler(ev, behavior, state, setters, notifyChange) {
  const { svg, atX, startX, endX, maxX, dragging, step, timespan } = state
  const { setMoved, setStartX, setEndX, setPrevious } = setters

  const newRange = { startX, endX }
  const parentX = svg.getBoundingClientRect().x

  if (dragging === START) {
    const x = ev.clientX - parentX

    if (behavior.rejectStartMove(x, atX, startX, endX)) return

    newRange.startX = ORIGIN + Math.round((x - ORIGIN) / step) * step
  } else if (dragging === END) {
    const x = ev.clientX - parentX

    if (behavior.rejectEndMove(x, atX, startX, endX)) return

    newRange.endX = ORIGIN + Math.round((x - ORIGIN) / step) * step
  } else if (dragging === WINDOW) {
    const x1 = startX + ev.movementX
    const x2 = endX + ev.movementX

    if (x1 < ORIGIN || x2 > maxX) return
    if (x1 === startX && x2 === endX) return

    if (behavior.rejectRangeMove(x1, x2, atX, startX, endX)) return

    newRange.startX = x1
    newRange.endX = x2

    setMoved(true)

    setStartX(newRange.startX)
    setEndX(newRange.endX)
    setPrevious(null)

    return
  } else {
    return
  }

  setStartX(newRange.startX)
  setEndX(newRange.endX)
  setPrevious(null)

  notifyChange(newRange.startX - ORIGIN, newRange.endX - ORIGIN, maxX, timespan)
}

function mouseUpHandler(state, setters, notifyChange) {
  const { setStartX, setEndX, setDrag, setMoved } = setters
  const { dragging, didMove, step, startX, endX, timespan, maxX } = state

  if (dragging === WINDOW && didMove) {
    const x1 = ORIGIN + Math.round((startX - ORIGIN) / step) * step
    const x2 = ORIGIN + Math.round((endX - ORIGIN) / step) * step

    setStartX(x1)
    setEndX(x2)

    notifyChange(x1 - ORIGIN, x2 - ORIGIN, maxX, timespan)
  }

  setDrag(undefined)
  setMoved(undefined)
}

const TimeRange = {}

TimeRange.Start = ({ children }) => {
  return children
}
TimeRange.End = ({ children }) => {
  return children
}
TimeRange.Now = ({ children }) => {
  return children
}
TimeRange.At = ({ children }) => {
  return children
}
TimeRange.Size = ({ children }) => {
  return children
}
TimeRange.Ticks = ({ children }) => {
  return children
}

export { TimeRange, TimeRangeAt, TimeRangeBeforeNow }
