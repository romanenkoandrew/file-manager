import { getUsernameFromArgs } from './getUserName.js'
import { logMsg } from './utils.js'
import readline from 'readline'
import { getOsInfo, dirname } from './os.js'
import { handlers } from './handlers.js'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const username = getUsernameFromArgs()
process.chdir(dirname)

const handleOsCommand = (input) => {
    const arg = input.split(' ')[1]
    const info = getOsInfo(arg)
    logMsg({ msg: info })
}

const commands = {
  '.exit': () => handlers.exit(username),
  'os': handleOsCommand,
  'up': handlers.up,
  'cd': handlers.cd,
  'ls': handlers.ls,
  'cat': handlers.readFile,
  'add': handlers.addFile,
  'mkdir': handlers.addDirectory,
  'rm': handlers.removeFile,
  'rn': handlers.rename,
  'cp': (input) => handlers.copyOrMove(input, 'cp'),
  'mv': (input) => handlers.copyOrMove(input, 'mv'),
  'hash': handlers.hashFile,
  'compress': (input) => handlers.zipFile(input, 'compress'),
  'decompress': (input) => handlers.zipFile(input, 'decompress')
}

const handleCommand = async (input) => {
  const [cmd] = input.split(' ')

  const handler = commands[cmd]

  if (handler) {
    await handler(input)
  } else {
    logMsg({ msg: `Invalid input: ${input}` });
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

rl.on('SIGINT', () => handlers.exit(username))
