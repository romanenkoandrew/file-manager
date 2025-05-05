import { createReadStream, createWriteStream } from 'fs'
import { createGzip, createGunzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { logMsg } from './utils.js'

export const compress = async (src, dest) => {
    const zip = createGzip()
    const readableStream = createReadStream(src)
    const writeableStream = createWriteStream(dest)

    try {
        await pipeline(
            readableStream,
            zip,
            writeableStream
        )
        logMsg({msg: `File ${src} compressed into ${dest} successfully`})
    } catch {
        throw new Error('Zip operation failed')
    }
}

export const decompress = async (src, dest) => {
    const unzip = createGunzip()
    const readableStream = createReadStream(src)
    const writeableStream = createWriteStream(dest)

    try {
        await pipeline(
            readableStream,
            unzip,
            writeableStream
        )
        logMsg({msg: `File ${src} decompressed into ${dest} successfully`})
    } catch {
        throw new Error('Unzip operation failed')
    }
}