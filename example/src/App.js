import React, { useState } from 'react'
import { Accordion, Button, Label, Modal, Segment } from 'semantic-ui-react'

import { TimeRange } from '@jeanlazarou/react-time-range'

import { Theme } from './Theme'
import { DemoHoursAtMoment } from './DemoHoursAtMoment'
import { DemoHoursBeforeNow } from './DemoHoursBeforeNow'
import { DemoMinutesBeforeNow } from './DemoMinutesBeforeNow'

import { CodeEditor } from './CodeEditor'

import { sourceCodeAfter } from './example_code'
import { sourceCodeBefore } from './example_code'

const panel = ({ key, title, content, openModal }, sourceCode) => {
  return {
    key: key,
    title: {
      content: <Label color='blue' content={title} />
    },
    content: {
      content: (
        <Segment compact>
          {content}
          <Button
            size='mini'
            color='teal'
            icon='edit outline'
            onClick={() => openModal()}
          />
        </Segment>
      )
    },
    code: sourceCode[key]
  }
}

const panelBefore = (options) => panel(options, sourceCodeBefore)
const panelAfter = (options) => panel(options, sourceCodeAfter)

const App = () => {
  const [open, openState] = useState(false)
  const [code, currentCode] = useState()

  const changeColor = (color) => {
    document.querySelectorAll('.rtr-range').forEach((item) => {
      item.style.fill = color
    })
  }

  const openModal = () => {
    openState(true)
  }

  const panelsBeforeNow = [
    panelBefore({
      key: '10hours',
      title: '10 hours range with ticks every hour',
      content: (
        <DemoHoursBeforeNow timespan={10}>
          <TimeRange.Ticks every={1} />
        </DemoHoursBeforeNow>
      ),
      openModal
    }),
    panelBefore({
      key: '24hours',
      title: '24 hours range with default ticks',
      content: (
        <DemoHoursBeforeNow timespan={24}>
          <TimeRange.Ticks />
        </DemoHoursBeforeNow>
      ),
      openModal
    }),
    panelBefore({
      key: '120minutes',
      title: '120 minutes range without ticks',
      content: <DemoMinutesBeforeNow />,
      openModal
    }),
    panelBefore({
      key: '120minutes-ticks',
      title: '120 minutes range with ticks every 10 minutes',
      content: (
        <DemoMinutesBeforeNow>
          <TimeRange.Ticks every={10} />
        </DemoMinutesBeforeNow>
      ),
      openModal
    })
  ]

  const panelsAtMoment = [
    panelAfter({
      key: '24hours',
      title: '24 hours before 13:14 and 12 hours after',
      content: (
        <DemoHoursAtMoment at='13:14' spanBefore={24} spanAfter={12}>
          <TimeRange.Ticks every={1} />
        </DemoHoursAtMoment>
      ),
      openModal
    }),
    panelAfter({
      key: '12hours',
      title: '12 hours before 17:21 and 12 hours after',
      content: (
        <DemoHoursAtMoment at='17:21' spanBefore={12} spanAfter={12}>
          <TimeRange.Ticks every={1} />
        </DemoHoursAtMoment>
      ),
      openModal
    }),
    panelAfter({
      key: '15hours',
      title: '15 hours before 0:17 and 7 hours after',
      content: (
        <DemoHoursAtMoment at='0:17' spanBefore={15} spanAfter={7}>
          <TimeRange.Ticks every={1} />
        </DemoHoursAtMoment>
      ),
      openModal
    })
  ]

  const selectBeforeNow = (e, itemProps) => {
    const { index } = itemProps

    currentCode(panelsBeforeNow[index].code)
  }
  const selectAtMoment = (e, itemProps) => {
    const { index } = itemProps

    currentCode(panelsAtMoment[index].code)
  }

  return (
    <div>
      <Theme onChange={changeColor} />

      <h2>Before now...</h2>
      <Accordion panels={panelsBeforeNow} onTitleClick={selectBeforeNow} />

      <h2>Time range around a moment</h2>
      <Accordion panels={panelsAtMoment} onTitleClick={selectAtMoment} />

      <Modal open={open} onClose={() => openState(false)} closeIcon>
        <Modal.Content>
          <CodeEditor defaultCode={code} />
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default App
