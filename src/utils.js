// trigger user-download
export const download = (filenme, data) => {}

// read a browser file-opbject, return a promise
export const readAsArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    resolve(reader.result)
  })
  reader.readAsArrayBuffer(file)
})
