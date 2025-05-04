export const getUsernameFromArgs = () => {
    const args = process.argv.slice(2)
    const index = args.findIndex((el) => {
        return el === '--username'
    })

    if (index !== -1 && args[index + 1]) {
        return args[index + 1]
    }

    return 'John Doe'
};