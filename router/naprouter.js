const router = require('express').Router()
const axios = require('axios')
const crypto = require('crypto')

const PartnerCode = 'hyn7'
const partnerKey = 'f74f2be59d5e6c4f8bf23bbed950317b'

router.post('/naptienbank', async (req, res) => {
  try {
    const { BankCode, RefCode, Amount, CallbackUrl } = req.body
    const rawString =
      PartnerCode + BankCode + Amount + RefCode + CallbackUrl + partnerKey
    const hash = crypto.createHash('md5').update(rawString).digest('hex')
    const response = await axios.post(
      'https://bankgate.coroach.xyz/bankin/Order.ashx',
      {
        PartnerCode,
        BankCode,
        Amount,
        RefCode,
        CallbackUrl,
        Signature: hash
      }
    )
    if (response.status === 200) {
      res.json(response.data)
    } else {
      res.status(400).json(response.data)
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/callback', async (req, res) => {
  try {
    const { ResponseCode, Description, ResponseContent, Signature } = req.body

    const expectedSignature = crypto
      .createHash('md5')
      .update(ResponseCode + Description + ResponseContent + partnerKey)
      .digest('hex')

    if (Signature !== expectedSignature) {
      return res.status(403).json({ error: 'Chữ ký không hợp lệ!' })
    }
    if (!ResponseContent) {
      console.log('Giao dịch thất bại')
      return res.json({ message: 'thất bại' })
    }
    console.log('Giao dịch thành công')
    res.send('Callback xử lý thành công!')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
