import { createReadStream } from 'fs'
import { createHash } from 'crypto'
import { pipeline } from 'stream/promises'

export const hash = async (path) => {
    try {
        const hash = createHash('sha256').setEncoding('hex')
        const stream = createReadStream(path)
        
        await pipeline(stream, hash)
        return hash.digest('hex')
    } catch {
        throw new Error('Hash operation failed')
    }
}