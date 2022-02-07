import CLIENT from './client'

CLIENT.on('error', (err) => {
  console.log(`Client error!! err: ${err}`)
})
