import ATV from 'atvjs'
import template from './template.hbs'
import context_menu from './context-menu.hbs'
import API from 'lib/api.js'

const AlbumsPage = ATV.Page.create({
  name: 'albums',
  template: template,
  events: {
    holdselect: 'onHoldSelect'
  },
  ready (options, resolve, reject) {
    var allAlbums = API.get(API.url.albums())
    var recentAlbums = API.get(API.url.search({
      type: 'album',
      expression: "media_kind is music and time_added after 8 weeks ago having track_count > 3 order by time_added desc"
    }))

    Promise
      .all([allAlbums, recentAlbums])
      .then((xhrs) => {
        var obj = {
          all: xhrs[0].response.albums
        }
        if (xhrs[1].response.albums.total > 0)
          obj.recent = xhrs[1].response.albums
        resolve(obj)
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
  onHoldSelect(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'lockup') {
      var album = JSON.parse(element.getAttribute("data-href-page-options"))
      var doc = ATV.Navigation.presentModal({
        template: context_menu,
        data: {
          album: album.name,
          artist: album.artist
        }
      })

      doc
        .getElementById('add-btn')
        .addEventListener('select', () => {
          API
            .post(API.url.queueAddItems([album.uri]))
            .then(() => {
              ATV.Navigation.dismissModal()
              return true
            })
        })
      doc
        .getElementById('play-btn')
        .addEventListener('select', () => {
          API
            .put(API.url.queueClear())
            .then(() => {
              return API.post(API.url.queueAddItems([album.uri]))
            })
            .then(() => {
              return API.put(API.url.playerPlay())
            })
            .then(() => {
              ATV.Navigation.dismissModal()
              return true
            })
        })
    }
  },
})

export default AlbumsPage
