import { getUsernameFromArgs } from './getUserName.js'
import { logMsg } from './utils.js'
import process from 'node:process'
import readline from 'readline'
import { getOsInfo } from './os.js'

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

username = getUsernameFromArgs()
logMsg(username)

rl.on('line', (line) => {
    const trimmedLine = line.trim()

    if (trimmedLine.includes('.exit')) {
        handleExit()
        return 
    } else if (trimmedLine.startsWith('os')) {
        const arg = trimmedLine.split(' ')[1]
        rl.write(`${getOsInfo(arg)}\n`)
        return
    }
})

rl.on('SIGINT', handleExit)
