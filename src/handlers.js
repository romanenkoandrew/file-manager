import fs from 'node:fs/promises'
import path from 'path'
import { createFile, createDirectory, read, deleteFile, renameFile, copyOrMoveFile } from './fs.js'
import { hash } from './hash.js'
import { compress, decompress } from './zip.js'
import { logMsg } from './utils.js'

const exit = (username) => {
    logMsg({ msg: username, type: 'finish' })
    process.exit(0)
}

const up = () => {
    const parentDir = path.dirname(process.cwd())
    process.chdir(parentDir)
}

const cd = (input) => {
    const target = input.replace('cd', '').trim()
    if (!target) {
        logMsg({ msg: 'No path provided' })
        return
    }
    try {
        process.chdir(target)
    } catch (err) {
        logMsg({ msg: `Operation failed: ${err.message}` })
    }
}

const ls = async () => {
    try {
        const dirInfo = await fs.readdir(process.cwd(), { withFileTypes: true })

        const result = dirInfo.map(el => ({
            name: el.name,
            type: el.isDirectory() ? 'directory' : el.isFile() ? 'file' : 'other'
        }))

        console.table(result)
    } catch (err) {
        logMsg({ msg: `Operation failed: ${err.message}` })
    }
}

const readFile = async (input) => {
    const target = input.replace('cat', '').trim()
    if (!target) {
        logMsg({ msg: 'No path provided' })
        return
    }

    try {
        const data = await read(target)
        logMsg({ msg: data })
    } catch (err) {
        logMsg({ msg: `Operation failed: ${err.message}` })
    }
}

const addFile = async (input) => {
    const name = input.replace('add', '').trim()

    if (!name) {
        logMsg({ msg: 'No file name provided' })
        return
    }

    await createFile(name)
}

const addDirectory = async (input) => {
    const name = input.replace('mkdir', '').trim()

    if (!name) {
        logMsg({ msg: 'No directory name provided' })
        return
    }

    await createDirectory(name)
}

const removeFile = async (input) => {
    const name = input.replace('rm', '').trim()

    if (!name) {
        logMsg({ msg: 'No file name provided' })
        return
    }

    await deleteFile(name)
}

const rename = async (input) => {
    const args = input.replace('rn', '').trim()
    const splitedArgs = args.split(' ')

    let oldName = splitedArgs[0]
    let newName = splitedArgs[1]

    if (splitedArgs.length !== 2) {
        const match = args.match(/\.\w{2,5}/)

        if (!match) {
            logMsg({ msg: 'The file must have the extension' })
            return
        }

        const extIndex = args.indexOf(match[0]) + match[0].length

        oldName = args.slice(0, extIndex).trim()
        newName = args.slice(extIndex).trim()
    }

    if (!oldName || !newName) {
        logMsg({ msg: 'Incorrect arguments' })
        return
    }

    await renameFile(oldName, newName)
}

const copyOrMove = async (input, type) => {
    const args = input.replace(type === 'copy' ? 'cp' : 'mv', '').trim()
    const splitedArgs = args.split(' ')

    if (splitedArgs.length !== 2) {
        logMsg({ msg: 'Incorrect arguments' })
        return
    }

    await copyOrMoveFile(splitedArgs[0], splitedArgs[1], type)
}

const hashFile = async (input) => {
    const name = input.replace('hash', '').trim()

    if (!name) {
        logMsg({ msg: 'No file name provided' })
        return
    }

    const data = await hash(name)
    logMsg({ msg: data })
}

const zipFile = async (input, type) => {
    const args = input.replace(type, '').trim()
    const splitedArgs = args.split(' ')

    if (splitedArgs.length !== 2) {
        logMsg({ msg: 'Incorrect arguments' })
        return
    }

    type === 'compress' ? await compress(splitedArgs[0], splitedArgs[1]) : decompress(splitedArgs[0], splitedArgs[1])
}

export const handlers = {
    exit,
    up,
    cd,
    ls,
    readFile,
    addFile,
    addDirectory,
    removeFile,
    rename,
    copyOrMove,
    hashFile,
    zipFile
}