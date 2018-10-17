# AC AdobeIO
This is a SDK for the Adobe Stock footage API.

## Usage
```
const acAdobeIO = require('ac-adobeio')

acAdobeIO.init({
  clientId: 'xxx',
  clientSecret: 'xxx',
  jwtParams: {
    "iss": "xxx@AdobeOrg",
    "sub": "xxx@techacct.adobe.com",
    key: fs.readFileSync('private.key'),
  }
})

acAdobeIO.profile({}, (err, result) => {
  console.log(err, result)
})
```

