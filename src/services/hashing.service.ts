import { compare, hash } from 'bcrypt'
const saltRounds = 10

export class HashingService {
  static hash(value: string) {
    return hash(value, saltRounds)
  }

  static compare(value: string, hash: string) {
    return compare(value, hash)
  }
}
