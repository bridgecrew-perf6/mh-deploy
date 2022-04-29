const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/webhook', secret: 'tj991118.' })

const RunCmd = (cmd, args, cb) => {
  const spawn = require('child_process').spawn
  const child = spawn(cmd, args)
  let result = ''
  child.stdout.on('data', data => {
    result += data.toString()
  })
  child.stdout.on('end', () => {
    cb(result)
  })
}

http
  .createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end('no such location')
    })
    console.log('create')
  })
  .listen(8080)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  )
})

handler.on('issues', function (event) {
  console.log(
    'Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title
  )
})
