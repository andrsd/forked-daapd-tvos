import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/api.js'

const ArtistAlbumsPage = ATV.Page.create({
  name: 'artist-albums',
  template: template,
  ready (options, resolve, reject) {
    API
      .get(API.url.artistAlbums(options.id))
      .then((xhr) => {
        var res = xhr.response
        resolve({
          artist_name: options.name,
          items: res.items,
          total: res.total
        })
      }, (xhr) => {
        ATV.Navigation.showError({
          data: {
            title: 'Error',
            message: xhr.statusText
          },
          type: 'document'
        })
        resolve(true)
      })
  }
})

export default ArtistAlbumsPage
