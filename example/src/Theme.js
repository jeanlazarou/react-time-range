import React, { useState } from 'react'

const lightColors = [
  '#f4303073',
  '#f6e23796',
  '#20c9a2b3',
  '#d471d6b3',
  '#ced3d9a0'
]

const darkColors = [
  '#d80b0bbf',
  '#8e800b96',
  '#3c8e8ead',
  '#6c146ea3',
  '#6061668f'
]

function Bullet({ active, color }) {
  const style = {
    color: active ? color : 'white',
    position: 'relative',
    right: 3,
    top: 6
  }

  return <span style={style}>◉</span>
}

function ColorButton({ active, color, onClick }) {
  const style = {
    margin: 5,
    width: 30,
    height: 30,
    backgroundColor: color
  }

  return (
    <div>
      <button style={style} onClick={() => onClick(color)} />
      <Bullet active={active} color={color} />
    </div>
  )
}

function Colors({ activeColor, colors, onClick }) {
  return (
    <div>
      {colors.map((color) => (
        <ColorButton
          key={color}
          color={color}
          active={activeColor === color}
          onClick={onClick}
        />
      ))}
    </div>
  )
}

export function Theme({ onChange }) {
  const [activeColor, setColor] = useState(null)

  const changed = (color) => {
    onChange(color)
    setColor(color)
  }

  return (
    <>
      <div style={{ position: 'fixed', right: 10 }}>
        <div style={{ float: 'right', display: 'flex' }}>
          <Colors
            activeColor={activeColor}
            colors={lightColors}
            onClick={changed}
          />
          <Colors
            activeColor={activeColor}
            colors={darkColors}
            onClick={changed}
          />
        </div>

        <h3 style={{ margin: 5, color: activeColor }}>{activeColor}</h3>
      </div>
    </>
  )
}
