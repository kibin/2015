import './player.styl'

import { div, span, iframe } from '@motorcycle/dom'
import { combine } from 'most'
import { prop, not } from 'ramda'

const intent = DOM => ({
  close$: DOM.select(`.player-close`).events(`click`),
  toggle$: DOM.select(`.player-toggle`).events(`click`),
})

const model = (actions, props$) => {
  const close$ = actions.close$.startWith().constant({ isPlaying: false })
  const play$ = close$.merge(props$)
  const toggle$ = combine(
    (toggle, { isPlaying }) => isPlaying ? toggle : false,
    actions.toggle$.scan(not).startWith(false),
    play$,
  )

  return combine(
    ({ isPlaying, song }, minimized) => ({ isPlaying, song, minimized }),
    play$,
    toggle$,
  )
}

const view = state$ => state$.map(({ isPlaying, song, minimized }) =>
  !isPlaying ? span(``) :
  div(`.player`, {
    style: {
      height: minimized ? `30px` : `auto`,
      width: minimized ? `100px` : `auto`,
    },
  }, [
    div(`.player-buttons`, [
      div(minimized ? `.player-button.player-button_playing` : ``),
      div(`.player-button.player-button_${minimized ? `max` : `min`}imize.player-toggle`, minimized ? `❏` : `⏤ `),
      div(`.player-button.player-button_close.player-close`, `✕`),
    ]),
    iframe(`.youtube`, {
      style: { display: `block` },
      props: {
        width: 560,
        height: 315,
        frameBorder: 0,
        allowFullscreen: `allowfullscreen`,
        src: `https://www.youtube.com/embed/${song}?rel=0&amp;showinfo=0&autoplay=1`,
      },
    }),
  ]),
)

export function Player({ DOM, props$ }) {
  const actions = intent(DOM)
  const state$ = model(actions, props$)

  return {
    state$,
    DOM: view(state$),
  }
}
