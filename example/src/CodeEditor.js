import React, { useState } from 'react'
import { useView, Compiler, Editor, Error, ActionButtons } from 'react-view'

import {
  TimeRange,
  TimeRangeBeforeNow,
  TimeRangeAt
} from '@jeanlazarou/react-time-range'

import { formatTime, humanizeHours } from './utils'

export const CodeEditor = ({ defaultCode }) => {
  const params = useView({
    initialCode: defaultCode,
    scope: {
      humanizeHours,
      formatTime,
      TimeRangeBeforeNow,
      TimeRange,
      TimeRangeAt,
      useState
    }
  })
  return (
    <React.Fragment>
      <Compiler {...params.compilerProps} />
      <Editor {...params.editorProps} />
      <Error {...params.errorProps} />
      <ActionButtons {...params.actions} />
    </React.Fragment>
  )
}
