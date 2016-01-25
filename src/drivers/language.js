import { of } from 'most'
import { split, head, path, compose } from 'ramda'

export function makeLanguageDriver() {
  const getLanguage = compose(head, split(`-`), path([`navigator`, `language`]))

  return _ => of(getLanguage(window))
}
