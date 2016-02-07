import './release.styl'

import { div, h2, h3, hr, span } from '@motorcycle/dom'
import { prop, path, not, isNil } from 'ramda'
import { combine, of } from 'most'

import { texts } from 'data'

const intent = (DOM, props$) => ({
  play$: props$.map(({ release }) => DOM
    .select(`.release-${release.key} .release-button`)
    .events(`click`)
    .map(_ => true)
  ).switch(),
})

const model = (actions, props$) => combine(
  (isPlaying, { release, lang, player }) => ({ release, isPlaying, lang }),
  actions.play$.scan(not).startWith(false),
  props$,
)

const view = state$ => state$
  .map(({ release, isPlaying, lang }) =>
    div(`.release.release-${prop(`key`, release)}`, [
      div(`.release-header`, [
        div(`.release-cover`, { style: {
          backgroundImage: `url(${prop(`cover`, release)})`
        } }),
        div(`.release-meta`, [
          h2(`.release-artist`, prop(`artist`, release)),
          h3(`.release-album`, prop(`release`, release)),
        ]),
      ]),
      div(`.release-content`, [
        div(`.release-place`, prop(`position`, release)),
        div(`.release-description`, [
          div(`.release-text`, `${path([lang, prop(`key`, release)], texts)}`),
          div(`.release-play`, [
            span(`.release-button`, isPlaying ? `◼︎` : `▶︎`),
            `${prop(`artist`, release)} – ${path([`song`, `name`], release)}`
          ]),
        ]),
      ]),
      hr(`.release-delimiter`),
    ]),
  )

export function Release({ DOM, props$ }) {
  const actions = intent(DOM, props$)
  const state$ = model(actions, props$)

  return {
    state$,
    DOM: view(state$),
  }
}
