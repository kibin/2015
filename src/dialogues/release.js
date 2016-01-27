import './release.styl'

import { div, h2, h3, hr, span } from '@motorcycle/dom'
import { prop, path } from 'ramda'
import { combine, of } from 'most'

const intent = DOM => ({
  play$: DOM.select(`.release-button`).events(`click`)
})

const model = (actions, props$) => combine(
  (isPlaying, { release }) => ({ release, isPlaying }),
  actions.play$.startWith(false).scan(prev => !prev),
  props$,
)

const view = state$ => state$
  .map(({ release, isPlaying }) =>
    div(`.release`, [
      div(`.release-header`, [
        div(`.release-cover`, { style: { backgroundImage: `url(${prop(`cover`, release)})` } }),
        div(`.release-meta`, [
          h2(`.release-artist`, prop(`artist`, release)),
          h3(`.release-album`, prop(`release`, release)),
        ]),
      ]),
      div(`.release-content`, [
        div(`.release-place`, prop(`position`, release)),
        div(`.release-description`, [
          div(`.release-text`, path([`text`, `ru`], release)),
          div(`.release-play`, [
            span(`.release-button`, isPlaying ? `▶︎` : `◼︎`),
            `${prop(`artist`, release)} – ${path([`song`, `name`], release)}`
          ]),
        ]),
      ]),
      hr(`.release-delimiter`),
    ]),
  )

export function Release({ DOM, props$ }) {
  const actions = intent(DOM)
  const state$ = model(actions, props$)

  return {
    state$,
    DOM: view(state$),
  }
}
