
var BASE_URL
var BASE_API_URL

function setBaseUrl(url) {
  BASE_URL = url
  BASE_API_URL = `${BASE_URL}/api`
}

function request(url, method) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'json'
    xhr.open(method, url)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    // listen to the state change
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
            return
        }

        if (xhr.status >= 200 && xhr.status <= 300) {
            resolve(xhr)
        } else {
            reject(xhr)
        }
    }
    // error handling
    xhr.addEventListener('error', () => reject(xhr))
    xhr.addEventListener('abort', () => reject(xhr))
    // send request
    xhr.send()
  })
}

function get(url) {
  return request(url, 'GET')
}

function put(url) {
  return request(url, 'PUT')
}

function post(url) {
  return request(url, 'POST')
}

const url = {
  // URLS Generators
  artists () {
    return `${BASE_API_URL}/library/artists`
  },
  artistAlbums (artist_id) {
    return `${BASE_API_URL}/library/artists/${artist_id}/albums`
  },
  albums () {
    // return `${BASE_API_URL}/library/albums`
    return `${BASE_API_URL}/search?query=&type=album&media_kind=music`
  },
  album (album_id) {
    return `${BASE_API_URL}/library/albums/${album_id}`
  },
  albumTracks (album_id) {
    return `${BASE_API_URL}/library/albums/${album_id}/tracks`
  },
  genres () {
    return `${BASE_API_URL}/library/genres`
  },
  genreAlbums (genre) {
    return `${BASE_API_URL}/search?type=albums&expression=` + encodeURIComponent("genre is \"" + genre + "\"")
  },
  audiobooks () {
    return `${BASE_API_URL}/search?query=&type=album&media_kind=audiobook`
  },
  search (opts) {
    var url = `${BASE_API_URL}/search?type=` + opts.type
    if (typeof opts.query != 'undefined')
      url = url + `&query=` + opts.query
    if (typeof opts.media_kind != 'undefined')
      url = url + `&media_kind=` + opts.media_kind
    if (typeof opts.expression != 'undefined')
      url = url + `&expression=` + encodeURIComponent(opts.expression)
    return url
  },
  queue () {
    return `${BASE_API_URL}/queue`
  },
  queueClear () {
    return `${BASE_API_URL}/queue/clear`
  },
  queueAddItems (uris) {
    return `${BASE_API_URL}/queue/items/add?uris=` + uris.join(',')
  },
  player () {
    return `${BASE_API_URL}/player`
  },
  playerPreviousTrack () {
    return `${BASE_API_URL}/player/previous`
  },
  playerNextTrack () {
    return `${BASE_API_URL}/player/next`
  },
  playerPlay () {
    return `${BASE_API_URL}/player/play`
  },
  playerPause () {
    return `${BASE_API_URL}/player/pause`
  },
  playerStop () {
    return `${BASE_API_URL}/player/stop`
  },
  artworkUrl (url) {
    return `${BASE_URL}${url}`
  }
}

export default {
  setBaseUrl,
  get,
  put,
  post,
  url
}
