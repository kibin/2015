import './app.styl'

import { article, div, h1, header, hr } from '@motorcycle/dom'
import isolate from '@cycle/isolate'
import {
  compose,
  has,
  head,
  identity,
  isNil,
  map,
  not,
  path,
  prop,
  reverse,
  sortBy,
  without,
} from 'ramda'
import { of, from, combine, join } from 'most'

import { Player, Release } from 'dialogues'
import { releases, texts } from 'data'

const createRelease = DOM => lang => release =>
  Release({ DOM, props$: of({ lang, release }) })

const makeChart = (DOM, lang) => compose(
  map(createRelease(DOM)(lang)),
  reverse,
  sortBy(prop(`position`)),
)

export function App({ DOM, Language }) {
  const releases$ = of(releases)
  const texts$ = of(texts)

  const initialLang$ = Language.map(lang => has(lang, texts) ? lang : `en`)
  const nextLang$ = DOM.select(`.lang`).events(`click`)
  const lang$ = initialLang$.concat(nextLang$)
    .scan((prev, next) => prev ? head(without(prev, [`en`, `ru`])) : next)

  const children$ = combine(
    (lang, releases) => makeChart(DOM, lang)(releases),
    lang$,
    releases$,
  )
  const childrenState$ = children$
    .map(compose(compose(join, from), map(prop(`state$`))))
    .switch()
  const childrenVtree$ = children$
    .map(map(prop(`DOM`)))

  const play$ = childrenState$
    .map(({ isPlaying, release }) =>
      ({ isPlaying, song: path([`song`, `link`], release) })
    )
  const player = Player({ DOM, props$: play$ })

  const state$ = combine(
    (lang, texts, chart) => ({ lang, texts, chart }),
    lang$,
    texts$,
    childrenVtree$,
  )

  return {
    DOM: state$.map(({ lang, texts, chart }) =>
      div([
        header(`.intro`, [
          h1(`.title`, `The best of 2015 in music`),
          hr(`.dash`),
        ]),

        div(`.lang`, prop(lang, { ru: `Read in english`, en: `Читать на русском` })),

        div(`.content`, [
          article(`.description`, path([lang, `about`], texts)),
          ...chart,
        ]),
        player.DOM,
      ]),
    ),
  }
}
