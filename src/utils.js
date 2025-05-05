import { access } from 'fs/promises'

const messages = {
    welcome: 'Welcome to the File Manager,',
    directory: 'You are currently in',
    finish: (val) => `Thank you for using File Manager, ${val}, goodbye!`,
}

export const logMsg = ({ msg, type }) => {
    switch (type) {
        case 'welcome': 
            return process.stdout.write(`${messages[type]} ${msg}!\n`)
        case 'directory': 
            return process.stdout.write(`${messages[type]} ${msg}\n`)
        case 'finish': 
            return process.stdout.write(`${messages[type](msg)}\n`)
        default: 
            return process.stdout.write(`${msg}\n`)
    }
} 

export const pathNotExists = async (path) => {
    try {
        await access(path)
        throw new Error()
    } catch (err) {
        if (err.code !== 'ENOENT') throw err
    }
}