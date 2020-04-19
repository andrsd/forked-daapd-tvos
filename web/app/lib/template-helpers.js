import ATV from 'atvjs'
import Handlebars from 'handlebars'
import API from './api.js'

const _ = ATV._

function assetUrl (name) {
  return `${ATV.launchOptions.BASEURL}/assets/${name}`
}

const helpers = {
  toJSON (obj = {}) {
    let str
    try {
      str = JSON.stringify(obj)
    } catch (ex) {
      str = '{}'
    }
    return str
  },
  asset_url (asset) {
    return new Handlebars.SafeString(assetUrl(asset))
  },
  fullImageURL (imageURL) {
    return new Handlebars.SafeString(imageURL)
  },
  artworkUrl (url) {
    if (url[0] == '/')
      return new Handlebars.SafeString(API.url.artworkUrl(url))
    else
      return new Handlebars.SafeString(url)
  },
  trackLength (len) {
    var secs = Math.floor((len / 1000) % 60)
    var minutes = Math.floor((len / (1000 * 60)) % 60)
    return ('0' + minutes).slice(-2) + ":" + ('0' + secs).slice(-2)
  },
  trackCount (tracks) {
    if (tracks == 1)
      return tracks + " track"
    else
      return tracks + " tracks"
  }
}

// register all helpers
_.each(helpers, (fn, name) => Handlebars.registerHelper(name, fn))

export default {
  helpers
}
