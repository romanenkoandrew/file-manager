import { getUsernameFromArgs } from './getUserName.js'
import { logMsg } from './utils.js'
import readline from 'readline'
import { getOsInfo, dirname } from './os.js'
import path from 'node:path'
import fs from 'node:fs/promises'

const availableCommands = [
    '.exit'
]

const getCommand = (data) => {
    availableCommands.find(data)
}

let username

const handleExit = () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`)
    process.exit(0)
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

process.chdir(dirname)

username = getUsernameFromArgs()
logMsg({msg: username, type: 'welcome'})
logMsg({msg: process.cwd(), type: 'directory'})

rl.on('line', async (line) => {
    const input = line.trim()

    if (input === '.exit') {
        handleExit()
    } else if (input.startsWith('os')) {
        const arg = input.split(' ')[1]
        logMsg({msg: getOsInfo(arg)})
    } else if (input === 'up') {
        const parentDir = path.dirname(process.cwd())
        process.chdir(parentDir)
    } else if (input.startsWith('cd')) {
        const arg = input.split(' ').slice(1, input.length).join(' ')
        process.chdir(arg)
    } else if (input === 'ls') {
        const dirInfo = await fs.readdir(process.cwd(), { withFileTypes: true })
        const result = []
        dirInfo.map(el => {
            const type = el.isDirectory() ? 'directory' : el.isFile() ? 'file' : 'other' 
            return result.push({name: el.name, type })
        })
        console.table(result)
    }
    logMsg({msg: process.cwd(), type: 'directory'})
})

rl.on('SIGINT', handleExit)
