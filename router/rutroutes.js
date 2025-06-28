const router = require('express').Router()
const axios = require('axios')
const crypto = require('crypto')

const PartnerCode = process.env.PARTNER_CODE
const partnerKey = process.env.PARTNER_KEY

router.post('/ruttienbank', async (req, res) => {
  try {
    const {
      BankCode,
      AccountName,
      AccountNumber,
      CallbackUrl,
      RefCode,
      Amount
    } = req.body
    const rawString =
      PartnerCode +
      AccountNumber +
      AccountName +
      BankCode +
      Amount +
      RefCode +
      CallbackUrl +
      partnerKey
    const hash = crypto.createHash('md5').update(rawString).digest('hex')
    const response = await axios.post(
      'https://bankgate.coroach.xyz/bankout/cash.ashx',
      {
        BankCode,
        PartnerCode,
        AccountName,
        AccountNumber,
        CallbackUrl,
        RefCode,
        Amount,
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

module.exports = router
