module.exports = {
  endpoints: {
    license: 'https://stock.adobe.io/Rest/Libraries/1/Content/License',
    licenseHistory: 'https://stock.adobe.io/Rest/Libraries/1/Member/LicenseHistory',
    profile: 'https://stock.adobe.io/Rest/Libraries/1/Member/Profile',
    search: 'https://stock.adobe.io/Rest/Media/1/Search/Files',

  },
  jwt: {
    endpoint: 'https://ims-na1.adobelogin.com/ims/exchange/v1/jwt',
    audPrefix: 'https://ims-na1.adobelogin.com/c/'
  }
}