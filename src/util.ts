import { promises as fs } from 'fs'
import { E, flow, s, TE } from './prelude'

export const readFile = (filename: string) => TE.tryCatch(() => fs.readFile(filename, 'utf8'), E.toError)

export const readLines = flow(readFile, TE.map(s.split('\n')))

export const main = (ma: TE.TaskEither<Error, unknown>) =>
  ma().then(
    E.fold(
      err => {
        console.error(err)
        process.exit(1)
      },
      result => {
        console.log(result)
        process.exit(0)
      }
    )
  )
