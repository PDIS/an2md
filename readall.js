const fs = require('fs')
const exec = require('child_process').exec

try {
  const arrayOfFiles = fs.readdirSync('./')
  arrayOfFiles.map((file) => {
    if (file.endsWith('.an.xml')) {
      const md = file.replace('an.xml', 'md')
      const child = exec(`node index.js ${file} ${md}`, (error) => {
        if (error !== null) {
          console.log(`exec error: ${error}`)
        }
      })
    }
  })
} catch (e) {
  console.log(e)
}
