import os from 'os'

export const dirname = os.homedir()

const getOsCpus = () => {
    const cpus = os.cpus()
    return `Overall amount of CPUS is ${cpus.length}\n${cpus.map(el => el.model).join('\n')}`
}


export const getOsInfo = (arg) => {
    if (!arg) {
        throw new Error('No args')
    }

    switch(arg.replace('--', '')) {
        case 'EOL': 
            return JSON.stringify(os.EOL)
        case 'cpus':
            return getOsCpus()
        case 'homedir':
            return os.homedir()
        case 'architecture':
        case 'arch':
            return os.arch()
        case 'username':
            return os.userInfo().username
        default: 
            return null
    }
}