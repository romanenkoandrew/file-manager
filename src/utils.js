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

export const getSrcAndDestFromArgs = (input, commandKeyword) => {
    const rawArgs = input.replace(new RegExp(`^${commandKeyword}\\s+`), '').trim()
    let error
  
    const plainArgs = rawArgs.split(' ')

    if (plainArgs.length === 2) {
      return { src: plainArgs[0], dest: plainArgs[1], error }
    }
  
    const match = rawArgs.match(/"(.+?)"\s+"(.+?)"/)

    if (match) {
      const [, src, dest] = match
      return { src, dest, error }
    }

    error = `Incorrect arguments. Example:\n ${commandKeyword} file1.txt file2.txt\n ${commandKeyword} "file 1.txt" "file 2.txt"`
  
    return { error }
  }
  