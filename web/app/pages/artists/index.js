import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/api.js'

const ArtistsPage = ATV.Page.create({
  name: 'artists',
  template: template,
  ready (options, resolve, reject) {
    API
      .get(API.url.artists())
      .then((xhr) => {
        var res = xhr.response
        resolve(res)
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

export default ArtistsPage
