export function humanizeHours(from, to) {
  const hours = to - from

  return hours === 1 ? `1 hour` : `${hours} hours`
}

export function formatTime(minutes) {
  const sign = minutes < 0 ? '-' : ''

  const m = Math.abs(minutes)

  const hours = Math.floor(m / 60)
  const rest = m % 60

  const toS = (x) => (x < 10 ? '0' + x : x)

  return `${sign}${toS(hours)}:${toS(rest)}`
}
