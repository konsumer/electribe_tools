// read a browser file-opbject, return a promise
export const readAsArrayBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    resolve(reader.result)
  })
  reader.readAsArrayBuffer(file)
})

// trigger user-download
export function download (filename, bytes) {
  const blob = new Blob([bytes])
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.addEventListener('click', () => {
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 0)
  }, false)
  a.click()
}

// get a random number to ID a single thing, in a list
export const getID = () => Math.random().toString(36).slice(2, 7)
