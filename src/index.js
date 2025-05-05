import { getUsernameFromArgs } from './getUserName.js'
import { logMsg } from './utils.js'
import readline from 'readline'
import { getOsInfo, dirname } from './os.js'
import path from 'node:path'
import fs from 'node:fs/promises'
import { createFile, createDirectory, read, deleteFile, renameFile, copyOrMoveFile } from './fs.js'
import { hash } from './hash.js'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const username = getUsernameFromArgs()
process.chdir(dirname)

const handleExit = () => {
    logMsg({msg: username, type: 'finish'})
    process.exit(0)
}

const handleOsCommand = (input) => {
    const arg = input.split(' ')[1]
    const info = getOsInfo(arg)
    logMsg({ msg: info })
}

const handleUp = () => {
    const parentDir = path.dirname(process.cwd())
    process.chdir(parentDir)
}

const handleCd = (input) => {
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

const handleLs = async () => {
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

const handleCat = async (input) => {
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

const handleAdd = async (input) => {
    const name = input.replace('add', '').trim()
    console.log('name', name)
    if (!name) {
        logMsg({ msg: 'No file name provided' })
        return
    }

    await createFile(name)
}

const handleMkdir = async (input) => {
    const name = input.replace('mkdir', '').trim()

    if (!name) {
        logMsg({ msg: 'No directory name provided' })
        return
    }

    await createDirectory(name)
}

const handleRm = async (input) => {
    const name = input.replace('rm', '').trim()

    if (!name) {
        logMsg({ msg: 'No file name provided' })
        return
    }

    await deleteFile(name)
}

const handleRn = async (input) => {
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

const handleCpAndMv = async (input, type) => {
  const args = input.replace(type === 'copy' ? 'cp' : 'mv', '').trim()
  const splitedArgs = args.split(' ')

  if (splitedArgs.length !== 2) {
      logMsg({ msg: 'Incorrect arguments' })
      return
  }

  await copyOrMoveFile(splitedArgs[0], splitedArgs[1], type)
}

const handleHash = async (input) => {
  const name = input.replace('hash', '').trim()

  if (!name) {
      logMsg({ msg: 'No file name provided' })
      return
  }

  const data = await hash(name)
  logMsg({ msg: data })
}

const handleCommand = async (input) => {
    switch (true) {
      case input === '.exit':
        handleExit()
        break
      case input.startsWith('os'):
        handleOsCommand(input)
        break
      case input === 'up':
        handleUp()
        break
      case input.startsWith('cd'):
        handleCd(input)
        break
      case input === 'ls':
        await handleLs()
        break
      case input.startsWith('cat'):
        await handleCat(input)
        break
      case input.startsWith('add'):
        await handleAdd(input)
        break
      case input.startsWith('mkdir'):
        await handleMkdir(input)
        break
      case input.startsWith('rm'):
        await handleRm(input)
        break
      case input.startsWith('rn'):
        await handleRn(input)
        break
      case input.startsWith('cp'):
        await handleCpAndMv(input, 'copy')
        break
      case input.startsWith('mv'):
        await handleCpAndMv(input, 'move')
        break
      case input.startsWith('hash'):
          await handleHash(input)
          break
      default:
        logMsg({ msg: `Invalid input: ${input}` })
    }
}

logMsg({msg: username, type: 'welcome'})
logMsg({msg: process.cwd(), type: 'directory'})

rl.on('line', async (line) => {
    const input = line.trim()
    try {
        await handleCommand(input)
        logMsg({ msg: process.cwd(), type: 'directory' })
    } catch (err) {
        logMsg({ msg: `${err}` })
        logMsg({ msg: 'Please enter next command.' })
    }
})

rl.on('SIGINT', handleExit)
