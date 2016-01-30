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
  isolate(Release)({ DOM, props$: of({ lang, release }) })

const makeChart = (DOM, lang) => compose(
  map(createRelease(DOM)(lang)),
  reverse,
  sortBy(prop(`position`)),
)

export function App({ DOM, Language }) {
  // stream of initial language
  const initialLang$ = Language.map(lang => has(lang, texts) ? lang : `en`)

  // stream of language clicks
  const nextLang$ = DOM.select(`.lang`).events(`click`)

  // stream of languages
  const lang$ = initialLang$.concat(nextLang$)
    .scan((prev, next) => prev ? head(without(prev, [`en`, `ru`])) : next)
    //.filter(compose(not, isNil))

  // stream of releases
  const releases$ = of(releases)

  // stream of texts
  const texts$ = of(texts)

  // stream of created releases
  const children$ = combine(
    (lang, releases) => makeChart(DOM, lang)(releases),
    lang$,
    releases$,
  )

  // stream of states of releases
  const childrenState$ = children$
    .map(compose(compose(join, from), map(prop(`state$`))))
    .join()

  // stream of vtrees of releases
  const childrenVtree$ = children$
    .map(map(prop(`DOM`)))

  // stream of playing
  const play$ = childrenState$
    .map(prop(`isPlaying`))
    .filter(identity)
    .startWith(false)

  const state$ = combine(
    (lang, isPlaying, texts, chart) => ({ lang, isPlaying, texts, chart }),
    lang$,
    play$,
    texts$,
    childrenVtree$,
  )

  //const player = Player(sources)

  return {
    DOM: state$.tap(x => console.log(x)).map(({ lang, isPlaying, texts, chart }) =>
      div([
        header(`.intro`, [
          h1(`.title`, `The best of 2015 in music`),
          hr(`.dash`),
        ]),
        `player: ${isPlaying ? `on` : `off`}`,

        div(`.lang`, prop(lang, { ru: `Read in english`, en: `Читать на русском` })),

        div(`.content`, [
          article(`.description`, path([lang, `about`], texts)),
          ...chart,
        ]),
        //player.DOM,
      ]),
    ),
  }
}
