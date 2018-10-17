const _ = require('lodash')
const request = require('superagent')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const config = require('./config')

const acAdobeIO = () => {
  let clientId
  let clientSecret
  let product = 'AdmiralCloud Adobe Stock IO SDK'
  let jwtParams = {
    iss: 'xx',
    sub: 'xxx',
    key: 'xxx'
  }

  let jwtToken = {
    access_token: 'xxx',
    expires: 0
  }

  const init = (params) => {
    clientId = _.get(params, 'clientId')
    clientSecret = _.get(params, 'clientSecret')
    _.merge(jwtParams, _.get(params, 'jwtParams'))
    if (_.get(params, 'product')) product = _.get(params, 'product')
  }

  const requestJWT = (cb) => {
    // check if JWT is still valid
    if (_.get(jwtToken, 'expires') > moment().unix()) {
      return cb()
    }

    let tokenPayload = {
      'exp': moment().add(1, 'day').unix(),
      'iss': _.get(jwtParams, 'iss'),
      'sub': _.get(jwtParams, 'sub'),
      'https://ims-na1.adobelogin.com/s/ent_stocksearch_sdk': true,
      'aud': _.get(config, 'jwt.audPrefix') + clientId
    }
    let payload = {
      jwt_token: jwt.sign(tokenPayload, _.get(jwtParams, 'key'), { algorithm: 'RS256' }),
      client_id: clientId,
      client_secret: clientSecret
    }
    request.post(_.get(config, 'jwt.endpoint'))
      .set({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
      .send(payload)
      .end((err, res) => {
        if (err) return cb(err)
        jwtToken = {
          access_token: _.get(res.body, 'access_token'),
          expires: _.get(tokenPayload, 'exp', 0)
        }
        return cb()
      })
  }

  /**
   *
   * @param params.contentId
   * @param params.license STRING Defaults to "Standard"
   * @param params.locale  STRING Defaults to "en_US"
   * @param {*} cb
   *
   *  { available_entitlement:
        { quota: 49,
          license_type_id: 42,
          has_credit_model: false,
          has_agency_model: true,
          is_cce: true,
          full_entitlement_quota: { standard_credits_quota: 49 } },
        member: { stock_id: 123456 },
        purchase_options:
        { state: 'possible',
          requires_checkout: false,
          message: 'This will use 1 of your 49 images.'
      }
    }
   *
   */

  const profile = (params, cb) => {
    requestJWT((err) => {
      if (err) return cb(err)

      const contentId = _.get(params, 'contentId')
      const license = _.get(params, 'license')
      const locale = _.get(params, 'locale')

      let payload = {
        content_id: contentId,
        license,
        locale
      }

      request
        .get(_.get(config, 'endpoints.profile'))
        .set({
          'x-api-key': clientId,
          'x-product': product,
          'Authorization': 'Bearer ' + _.get(jwtToken, 'access_token')
        })
        .query(payload)
        .end((err, res) => {
          return cb(err, _.get(res, 'body', {}))
        })
    })
  }

  /**
   * Returns the license history for the given user
   *
   * @param {*} cb (err, result)
   *
   * { nb_results: 1,
files:
  [ { license: 'Standard',
      license_date: '10/17/18, 8:20 AM',
      download_url: 'https://stock.adobe.com/Download/DownloadFileDirectly/xxxx',
      id: 75950374,
      title: 'five kittens',
      creator_name: 'adyafoto',
      creator_id: 205216144,
      content_url: 'https://stock.adobe.com/Rest/images/five-kittens/75950374',
      media_type_id: 1,
      vector_type: null,
      content_type: 'image/jpeg',
      height: 1667,
      width: 2500,
      details_url: 'https://stock.adobe.com/75950374?as_channel=affiliate&as_source=api&as_content=xxx' } ] }
    */

  const licenseHistory = (params, cb) => {
    requestJWT((err) => {
      if (err) return cb(err)
      request
        .get(_.get(config, 'endpoints.licenseHistory'))
        .set({
          'x-api-key': clientId,
          'x-product': product,
          'Authorization': 'Bearer ' + _.get(jwtToken, 'access_token')
        })
        .end((err, res) => {
          return cb(err, _.get(res, 'body', {}))
        })
    })
  }

  /**
   * Buys an item/license
   * @param params.content_id INT REQUIRED content id to licenses
   * @param params.license STRING REQUIRED License type (e.g 'Standard')
   * @param {*} cb (err, result)
   */
  const license = (params, cb) => {
    const contentId = _.get(params, 'contentId')
    if (!contentId) return cb({ message: 'contentId_required' })
    const license = _.get(params, 'license', 'Standard')

    requestJWT((err) => {
      if (err) return cb(err)

      const payload = {
        content_id: contentId,
        license
      }

      request.get(_.get(config, 'endpoints.license'))
        .set({
          'x-api-key': clientId,
          'x-product': product,
          'Authorization': 'Bearer ' + params.token
        })
        .query(payload)
        .end((err, res) => {
          console.log(33, err, res.body)
          console.log(35, 'USED', params)
          return cb()
        })
    })
  }

  return {
    init,
    requestJWT,
    profile,
    license,
    licenseHistory
  }
}

module.exports = acAdobeIO()
