import { promises as fs } from 'fs'
import path from 'path'
import { C, E, flow, M, n, pipe, RA, s, TE, tt } from './prelude'

const readFile = (filename: string) => TE.tryCatch(() => fs.readFile(filename, 'utf8'), E.toError)

const program = pipe(
  path.join(__dirname, 'day1.txt'),
  readFile,
  TE.chainEitherK(
    flow(
      s.split('\n'),
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
  ),
  TE.chainFirstIOK(C.log)
)

program().then(
  E.fold(
    err => {
      console.error(err)
      process.exit(1)
    },
    () => process.exit(0)
  )
)
