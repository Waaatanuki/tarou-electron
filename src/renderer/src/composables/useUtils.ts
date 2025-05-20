import { nanoid } from 'nanoid'

export function useNanoid(length = 10) {
  return nanoid(length)
}