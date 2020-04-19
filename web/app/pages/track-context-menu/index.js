import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/api.js'

const TrackContextMenuPage = ATV.Page.create({
  name: 'track-context-menu',
  template: template,
  ready (options, resolve, reject) {
    this.track = options.track
    resolve(this.track)
  },
  afterReady (doc) {
    const addToQueue = () => {
      API
        .post(API.url.queueAddItems([this.track.uri]))
        .then(() => {
          ATV.Navigation.back()
        })
    }
    doc
      .getElementById('add-btn')
      .addEventListener('select', addToQueue)
  },
  track: null
})

export default TrackContextMenuPage
