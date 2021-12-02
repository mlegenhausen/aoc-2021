import path from 'path'
import { E, flow, pipe, RA, RNEA, s, t, TE, tt, tuple } from './prelude'
import { main, readLines } from './util'
import { failure } from 'io-ts/PathReporter'

const Type = tt.nonEmptyArray(
  t.tuple([
    t.keyof({
      forward: null,
      down: null,
      up: null
    }),
    tt.NumberFromString
  ])
)

const program = pipe(
  path.join(__dirname, 'day2.txt'),
  readLines,
  TE.chainEitherK(
    flow(
      RA.map(s.split(' ')),
      Type.decode,
      E.mapLeft(errors => new Error(failure(errors).join('\n')))
    )
  ),
  TE.map(
    flow(
      RNEA.reduce(tuple(0, 0, 0), ([h, d, a], [direction, value]) => {
        switch (direction) {
          case 'down':
            return tuple(h, d, a + value)
          case 'forward':
            return tuple(h + value, d + value * a, a)
          case 'up':
            return tuple(h, d, a - value)
        }
      }),
      ([h, d]) => h * d
    )
  )
)

main(program)
