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

const handleCommand = async (input) => {
    switch (true) {
      case input === '.exit':
        handlers.exit(username)
        break
      case input.startsWith('os'):
        handleOsCommand(input)
        break
      case input === 'up':
        handlers.up()
        break
      case input.startsWith('cd'):
        handlers.cd(input)
        break
      case input === 'ls':
        await handlers.ls()
        break
      case input.startsWith('cat'):
        await handlers.readFile(input)
        break
      case input.startsWith('add'):
        await handlers.addFile(input)
        break
      case input.startsWith('mkdir'):
        await handlers.addDirectory(input)
        break
      case input.startsWith('rm'):
        await handlers.removeFile(input)
        break
      case input.startsWith('rn'):
        await handlers.rename(input)
        break
      case input.startsWith('cp'):
        await handlers.copyOrMove(input, 'cp')
        break
      case input.startsWith('mv'):
        await handlers.copyOrMove(input, 'mv')
        break
      case input.startsWith('hash'):
          await handlers.hashFile(input)
          break
      case input.startsWith('compress'):
          await handlers.zipFile(input, 'compress')
          break
      case input.startsWith('decompress'):
          await handlers.zipFile(input, 'decompress')
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

rl.on('SIGINT', () => handlers.exit(username))
