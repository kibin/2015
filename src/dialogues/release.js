import './release.styl'

import { div, h2, h3, hr } from '@motorcycle/dom'
import { prop, path } from 'ramda'

export function Release({ DOM, props$ }) {
  return {
    DOM: props$.map(artist =>
      div(`.release`, [
        div(`.release-header`, [
          div(`.release-cover`, { style: { backgroundImage: `url(${prop(`cover`, artist)})` } }),
          div(`.release-meta`, [
            h2(`.release-artist`, prop(`artist`, artist)),
            h3(`.release-album`, prop(`release`, artist)),
          ]),
        ]),
        div(`.release-content`, [
          div(`.release-place`, prop(`position`, artist)),
          div(`.release-description`, [
            div(`.release-text`, path([`text`, `ru`], artist)),
            div(`.release-play`, `▶︎  ${prop(`artist`, artist)} – ${path([`song`, `name`], artist)}`),
          ]),
        ]),
        hr(`.release-delimiter`),
      ]),
    ),
  }
}
