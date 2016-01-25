import './player.styl'

import { div, iframe } from '@motorcycle/dom'
import { just } from 'most'

export function Player({ DOM, props$ }) {
  const link = `1CV_sZuNRyc`
  return {
    DOM: just(
      div(`.player`, {
        style: {
          position: `fixed`,
          bottom: 0,
          right: 0,
        },
      }, [
        div(`.player-buttons`, [
          false && div(`.player-button.player-button_playing`),
          div(`.player-button.player-button_toggle`, `⏤ | ❏`),
          div(`.player-button.player-button_close`, `✕`),
        ]),
        iframe(`.youtube`, {
          style: { display: `block` },
          props: {
            width: 560,
            height: 315,
            frameBorder: 0,
            allowFullscreen: `allowfullscreen`,
            src: `https://www.youtube.com/embed/${link}?rel=0&amp;showinfo=0&autoplay=1`,
          },
        }),
      ]),
    ),
  }
}
