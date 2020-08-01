import ATV from 'atvjs'
import template from './template.hbs'
import context_menu from './context-menu.hbs'
import API from 'lib/api.js'
import TH from 'lib/template-helpers.js'

const AlbumTracksPage = ATV.Page.create({
  name: 'album-tracks',
  template: template,
  album: null,
  tracks: [],
  events: {
    select: 'onSelect',
    holdselect: 'onHoldSelect'
  },
  ready (options, resolve, reject) {
    let album_id = options.id

    let albumInfo = API.get(API.url.album(album_id))
    let albumTracks = API.get(API.url.albumTracks(album_id))

    Promise
      .all([albumInfo, albumTracks])
      .then((xhrs) => {
        this.album = xhrs[0].response
        this.tracks = xhrs[1].response.items

        if ('artwork_url' in this.album)
          this.album.artwork_url = TH.helpers.artworkUrl(this.album.artwork_url)
        else
          this.album.artwork_url = TH.helpers.assetUrl('img/album.png')

        resolve({
          info: this.album,
          tracks: this.tracks
        })
      }, (xhrs) => {
        ATV.Navigation.showError({
          data: {
            title: 'Error',
            message: ''
          },
          type: 'document'
        })
        resolve(true)
      })
  },
  afterReady(doc) {
    const goToArtist = () => {
      ATV.Navigation.navigate('artist-albums', {
        id: this.album.artist_id,
        name: this.album.artist
      })
    }

    doc
      .getElementById('artist-btn')
      .addEventListener('select', goToArtist)

    const playAlbum = () => {
      API
        .put(API.url.queueClear())
        .then(() => {
          return API.post(API.url.queueAddItems([this.album.uri]))
        })
        .then(() => {
          return API.put(API.url.playerPlay())
        })
        .then(() => {
          ATV.Navigation.clear()
          ATV.Navigation.navigateToMenuPage()
          // ATV.Navigation.navigate('playing-now', {})
          return true
        })
    }

    doc
      .getElementById('play-btn')
      .addEventListener('select', playAlbum)

    const addAlbumToQueue = () => {
      API
        .post(API.url.queueAddItems([this.album.uri]))
        .then(() => {
          return true
        }, () => {
          return false
        })
    }

    doc
      .getElementById('add-btn')
      .addEventListener('select', addAlbumToQueue)
  },
  onSelect(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var track = JSON.parse(element.getAttribute("data-href-page-options"))

      API
        .put(API.url.queueClear())
        .then(() => {
          return API.post(API.url.queueAddItems([track.uri]))
        })
        .then(() => {
          return API.put(API.url.playerPlay())
        })
        .then(() => {
          ATV.Navigation.clear()
          ATV.Navigation.navigateToMenuPage()
          return true
        })
    }
  },
  onHoldSelect(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var track = JSON.parse(element.getAttribute("data-href-page-options"))
      var doc = ATV.Navigation.presentModal({
        template: context_menu,
        data: {
          album: track.album,
          title: track.title
        }
      })

      doc
        .getElementById('add-btn')
        .addEventListener('select', () => {
          API
            .post(API.url.queueAddItems([track.uri]))
            .then(() => {
              ATV.Navigation.dismissModal()
              return true
            })
        })
    }
  },
})

export default AlbumTracksPage
