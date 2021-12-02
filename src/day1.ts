import path from 'path'
import { E, flow, M, n, pipe, RA, TE, tt } from './prelude'
import { main, readLines } from './util'

const program = pipe(
  path.join(__dirname, 'day1.txt'),
  readLines,
  TE.chainEitherK(
    flow(
      tt.nonEmptyArray(tt.NumberFromString).decode,
      E.mapLeft(() => new Error('DecodeError'))
    )
  ),
  TE.map(
    flow(
      RA.chop(as => [pipe(as, RA.takeLeft(3), M.concatAll(n.MonoidSum)), pipe(as, RA.dropLeft(1))]),
      RA.chop(([a, ...rest]) =>
        pipe(
          rest,
          RA.matchLeft(
            () => [0, []],
            b => [a < b ? 1 : 0, rest]
          )
        )
      ),
      M.concatAll(n.MonoidSum)
    )
  )
)

main(program)
