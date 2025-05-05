import fs from 'node:fs/promises'
import path from 'path'
import { createFile, createDirectory, read, deleteFile, renameFile, copyOrMoveFile } from './fs.js'
import { hash } from './hash.js'
import { compress, decompress } from './zip.js'
import { getSrcAndDestFromArgs, logMsg } from './utils.js'

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
    const { src, dest, error } = getSrcAndDestFromArgs(input, 'rn')
  
    if (error) {
      logMsg({ msg: error })
      return
    }

    await renameFile(src, dest)
  }
  

const copyOrMove = async (input, commandKeyword) => {
    const { src, dest, error } = getSrcAndDestFromArgs(input, commandKeyword)
  console.log('src', src)
  console.log('dest', dest)
  
    if (error) {
      logMsg({ msg: error })
      return
    }

    await copyOrMoveFile(src, dest, commandKeyword)
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

const zipFile = async (input, commandKeyword) => {
    const { src, dest, error } = getSrcAndDestFromArgs(input, commandKeyword)
  
    if (error) {
      logMsg({ msg: error })
      return
    }

    commandKeyword === 'compress' ? await compress(src, dest) : await decompress(src, dest)
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