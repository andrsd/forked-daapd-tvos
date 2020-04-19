import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/api.js'

const AudiobooksPage = ATV.Page.create({
  name: 'albums',
  template: template,
  ready (options, resolve, reject) {
    API
      .get(API.url.audiobooks())
      .then((xhr) => {
        var res = xhr.response
        resolve(res.albums)
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

export default AudiobooksPage
