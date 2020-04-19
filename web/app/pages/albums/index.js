import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/api.js'

const AlbumsPage = ATV.Page.create({
  name: 'albums',
  template: template,
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
  }
})

export default AlbumsPage
