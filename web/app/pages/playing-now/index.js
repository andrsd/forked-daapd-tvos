import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/api.js'

const PlayingNowPage = ATV.Page.create({
  name: 'playing-now',
  template: template,
  ready (options, resolve, reject) {
    let player = API.get(API.url.player())
    let queue = API.get(API.url.queue())

    Promise
      .all([player, queue])
      .then((xhrs) => {
        this.player = xhrs[0].response
        var queue = xhrs[1].response.items
        var current
        for (var it of queue) {
          if (it.id == player.item_id)
            current = it
        }

        resolve({
          player: player,
          current: current,
          queue: queue
        })
      }, (xhrs) => {
        reject()
      })
  },
  afterReady(doc) {
    const playerPrev = () => {
      API.put(API.url.playerPreviousTrack())
    }

    doc
      .getElementById('prev-btn')
      .addEventListener('select', playerPrev)

    const playerPlayPause = () => {
      var promise
      if (this.player.state == 'play')
        promise = API.put(API.url.playerPause())
      else
        promise = API.put(API.url.playerPlay())

      promise
        .then(() => {
          API.get(API.url.player ())
            .then((xhr) => {
                this.player = xhr.response
            }, (xhr) => {
            })
        }, () => {
        })
    }

    doc
      .getElementById('play-btn')
      .addEventListener('select', playerPlayPause)

    const playerNext = () => {
      API.put(API.url.playerNextTrack())
    }

    doc
      .getElementById('next-btn')
      .addEventListener('select', playerNext)
  },
  player: null
})

export default PlayingNowPage
