import ATV from 'atvjs'
import Handlebars from 'handlebars'
import API from './api.js'

const _ = ATV._

function asset_url (name) {
  return `${ATV.launchOptions.BASEURL}assets/${name}`
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
  assetUrl (asset) {
    return new Handlebars.SafeString(asset_url(asset))
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
  },
  formatTime (t) {
    var secs = Math.floor((t / 1000) % 60)
    var minutes = Math.floor((t / (1000 * 60)) % 60)
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24)

    if (hours > 0)
      return hours + ":" + ('0' + minutes).slice(-2) + ":" + ('0' + secs).slice(-2)
    else
      return ('0' + minutes).slice(-2) + ":" + ('0' + secs).slice(-2)
  }
}

// register all helpers
_.each(helpers, (fn, name) => Handlebars.registerHelper(name, fn))

export default {
  helpers,
  asset_url
}
