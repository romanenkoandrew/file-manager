export const getUsernameFromArgs = () => {
    const args = process.argv.slice(2)
    
    for (const arg of args) {
        if (arg.startsWith('--username=')) {
          const [, value] = arg.split('=')
          return value || 'John Doe'
        }
      }

    return 'John Doe'
};