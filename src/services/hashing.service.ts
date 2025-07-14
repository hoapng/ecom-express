import { compare, hash } from 'bcrypt'
const saltRounds = 10

export class HashingService {
  hash(value: string) {
    return hash(value, saltRounds)
  }

  compare(value: string, hash: string) {
    return compare(value, hash)
  }
}

export const hashingService = new HashingService()
