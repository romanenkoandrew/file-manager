
import { createReadStream } from 'fs'
import { writeFile, mkdir, rm, rename, access, cp } from 'fs/promises'
import { join } from 'path'
import { logMsg } from './utils.js'

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
  const oldPath = join(process.cwd(), oldName)
  const newPath = join(process.cwd(), newName)

  try {
    await access(oldPath)

    try {
        await access(newPath);
        throw new Error();
    } catch (err) {
        if (err.code !== 'ENOENT') throw err
    }

    await rename(oldPath, newPath)
    logMsg({msg: `File renamed from ${oldName} into ${newName} successfully`})

  } catch {
      throw new Error('FS operation failed')
  }
}
