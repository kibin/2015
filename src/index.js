import './styles/index.styl'

import { run } from '@motorcycle/core'
import { makeDOMDriver } from '@motorcycle/dom'

import { App } from 'dialogues/app'
import { makeLanguageDriver, makeCircularDependencyDriver } from 'drivers'

function main(sources) {
  const app = App(sources)

  return {
    DOM: app.DOM,
  }
}

run(main, {
  DOM: makeDOMDriver(`#content`),
  Language: makeLanguageDriver(),
  PlayerProxy: makeCircularDependencyDriver(),
})
