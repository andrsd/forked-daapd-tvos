import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/api.js'
import TH from 'lib/template-helpers.js'

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
        this.player.progress = this.player.item_progress_ms / this.player.item_length_ms
        var queue = xhrs[1].response.items
        var active_queue = []
        var current
        for (var it of queue) {
          if (it.id == this.player.item_id)
            current = it
          if (typeof current !== 'undefined')
            active_queue.push(it)
        }

        resolve({
          player: this.player,
          current: current,
          queue: active_queue,
          player_state_badge: this.playerStateBadge(this.player.state)
        })
      }, (xhrs) => {
        reject()
      })
  },
  afterReady(doc) {
    doc
      .getElementById('prev-btn')
      .addEventListener('select', () => {
        API.put(API.url.playerPreviousTrack())
      })

    doc
      .getElementById('play-btn')
      .addEventListener('select', () => {
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
                  doc.getElementById('play-btn').innerHTML = this.playerStateBadge(this.player.state)
              }, (xhr) => {
              })
          }, () => {
          })
      })

    doc
      .getElementById('next-btn')
      .addEventListener('select', () => {
        API.put(API.url.playerNextTrack())
      })

    setInterval(() => {
      API.get(API.url.player ())
        .then((xhr) => {
            doc
              .getElementById('current-time')
              .innerHTML = TH.helpers.formatTime(xhr.response.item_progress_ms)
            doc
              .getElementById('progress')
              .setAttribute("value", xhr.response.item_progress_ms / xhr.response.item_length_ms)
        }, (xhr) => {
        })
    }, 1000);
  },
  player: null,
  playerStateBadge(state) {
    if (state == 'play')
      return '<badge src="' + TH.assetUrl('img/pause.png') + '" width="96" height="96" />'
    else
      return '<badge src="' + TH.assetUrl('img/play.png') + '" width="96" height="96" />'
  }
})

export default PlayingNowPage
