
import { createReadStream, createWriteStream } from 'fs'
import { writeFile, mkdir, rm, rename, access, unlink, } from 'fs/promises'
import { pipeline } from 'stream/promises'
import { join } from 'path'
import { logMsg, pathNotExists } from './utils.js'

export const read = async (path) => {
    return new Promise((resolve, reject) => {
      let data = ''
      const stream = createReadStream(path, 'utf-8')
  
      stream.on('data', chunk => data += chunk)
      stream.on('end', () => resolve(data))
      stream.on('error', reject)
    })
}

export const createFile = async (name) => {
  try {
      const filePath = join(process.cwd(), name)
      await writeFile(filePath, '', { flag: 'ax+' })
      logMsg({msg: `File ${name} created successfully`})
  } catch {
      throw new Error('FS operation failed')
  }
}

export const createDirectory = async (name) => {
  try {
      const directoryPath = join(process.cwd(), name)
      await mkdir(directoryPath, { flag: 'ax+' })
      logMsg({msg: `Directory ${name} created successfully`})
  } catch {
      throw new Error('FS operation failed')
  }
}

export const deleteFile = async (name) => {
  try {
      const directoryPath = join(process.cwd(), name)
      await rm(directoryPath)
      logMsg({msg: `File ${name} deleted successfully`})
  } catch {
      throw new Error('FS operation failed')
  }
}

export const renameFile = async (oldName, newName) => {
  try {
    await access(oldName)
    await pathNotExists(newName)
    await rename(oldName, newName)
    logMsg({msg: `File renamed from ${oldName} into ${newName} successfully`})

  } catch {
      throw new Error('FS operation failed')
  }
}

export const copyOrMoveFile = async (src, dest, type = 'copy') => {
  try {
    await access(src)
    await pathNotExists(dest)

    const readStream = createReadStream(src)
    const writeStream = createWriteStream(dest)
    await pipeline(readStream, writeStream)

    if (type === 'move') {
      await unlink(src)
    }

    const text = type === 'move' ? 'moved' : 'copied'

    logMsg({msg: `File ${text} from ${src} to ${dest} successfully`})
  } catch {
      throw new Error('FS operation failed')
  }
}