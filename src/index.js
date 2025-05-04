import { getUsernameFromArgs } from './getUserName.js'
import { logMsg } from './utils.js'
import readline from 'readline'
import { getOsInfo, dirname } from './os.js'
import path from 'node:path'
import fs from 'node:fs/promises'

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
    const target = input.slice(3).trim()
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
      default:
        logMsg({ msg: `Invalid input: ${input}` })
    }
  
    logMsg({ msg: process.cwd(), type: 'directory' })
}

logMsg({msg: username, type: 'welcome'})
logMsg({msg: process.cwd(), type: 'directory'})

rl.on('line', async (line) => {
    const input = line.trim()
    await handleCommand(input)
})

rl.on('SIGINT', handleExit)
