import './app.styl'

import { article, div, h1, header, hr } from '@motorcycle/dom'
import isolate from '@cycle/isolate'
import { map, compose, sort, prop } from 'ramda'
import { of } from 'most'

import { Player, Release } from 'dialogues'
import { releases } from 'data'

export function App(sources) {
  const player = Player(sources)
  const list = compose(
    map(release => isolate(Release)({
      sources,
      props$: of(release),
    })),
    sort((a, b) => b.position - a.position),
  )(releases)

  return {
    DOM: sources.Language.map(language =>
      div([
        header(`.intro`, [
          h1(`.title`, `The best of 2015 in music`),
          hr(`.dash`),
        ]),

        div(`.content`, [
          article(`.description`, `It’s a little bit late,
                  but last year we decided to create top albums thing
                  like serious people, we ripped off design of pitchfork,
                  started up site and, like, all of that.
                  So here it is—it doesn’t have Lana or that
                  totally overrated XX-guy in it, but instead
                  has all the music that made us laughing, painting,
                  cooking, programming, dancing like apes, crying on the floor
                  and simply browsing the internets like normal kids.`),
          ...map(prop(`DOM`), list),
        ]),
        //player.DOM,
      ]),
    ),
  }
}
