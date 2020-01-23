const AWS = require('aws-sdk')
const keys = require('../config/keys')
const uuid = require('uuid/v1')
const requireLogin = require('../middlewares/requireLogin')

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  endpoint: 's3-ap-south-1.amazonaws.com',
  signatureVersion: 'v4',
  region: 'ap-south-1'
})

AWS.config.update({
  signatureVersion: 'v4'
})

module.exports = app => {
  app.get('/api/upload/', requireLogin, async (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'my-blog-bucket-1996',
        ContentType: 'image/jpeg',
        Key: key
      },
      (err, url) => {
        res.send({ key, url })
      }
    )
  })
}
