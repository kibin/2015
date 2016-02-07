import subject from 'most-subject'

export function makeCircularDependencyDriver() {
  return source$ => {
    const { sink, stream } = subject()

    source$
      .tap(x => console.log(`from driver`, x))
      .observe(value => sink.add(value))

    return { stream$: stream }
  }
}
