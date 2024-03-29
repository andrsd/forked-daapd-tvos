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
        this.queue = xhrs[1].response.items
        var active_queue = []
        var current
        for (var it of this.queue) {
          if (it.id == this.player.item_id)
            current = it
          if (typeof current !== 'undefined')
            active_queue.push(it)

          if ('artwork_url' in it)
            it.artwork_url = TH.helpers.artworkUrl(it.artwork_url)
          else
            it.artwork_url = TH.helpers.assetUrl('img/album.png')
        }

        if (active_queue.length > 0) {
          resolve({
            player: this.player,
            current: current,
            queue: active_queue,
            player_state_badge: this.playerStateBadge(this.player.state)
          })
        }
        else {
          resolve({
            player: { item_progress_ms: null, progress: 0, item_length_ms: null },
            current: { title: "Not playing", artist: "", album: ""},
            player_state_badge: this.playerStateBadge(this.player.state)
          })
        }
      }, (xhrs) => {
        reject()
      })
  },
  afterReady(doc) {
    doc
      .getElementById('prev-btn')
      .addEventListener('select', () => {
        API
          .put(API.url.playerPreviousTrack())
          .then(() => {
            return true
          })
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
            API
              .get(API.url.player ())
              .then((xhr) => {
                this.player = xhr.response
                doc.getElementById('play-btn').innerHTML = this.playerStateBadge(this.player.state)
                return true
              })
          }, () => {
            return false
          })
      })

    doc
      .getElementById('next-btn')
      .addEventListener('select', () => {
        API
          .put(API.url.playerNextTrack())
          .then(() => {
            return true
          })
      })

    setInterval(() => {
      API
        .get(API.url.queue())
        .then((xhr) => {
          this.queue = xhr.response.items
          if (this.queue && this.queue.length > 0) {
            for (const item of this.queue) {
              if (item.id == this.player.item_id) {
                doc
                  .getElementById('title')
                  .innerHTML = item.title
                doc
                  .getElementById('artist')
                  .innerHTML = item.artist
                doc
                  .getElementById('album')
                  .innerHTML = item.album
                break
              }
            }
          }
          else {
            doc
              .getElementById('title')
              .innerHTML = "Not playing"
            doc
              .getElementById('artist')
              .innerHTML = ""
            doc
              .getElementById('album')
              .innerHTML = ""

          }
          return true
        })

      API
        .get(API.url.player ())
        .then((xhr) => {
          this.player = xhr.response
          if (this.player.state == 'stop')
          {
            doc
              .getElementById('current-time')
              .innerHTML = ""
            doc
              .getElementById('progress')
              .setAttribute("value", 0)
            doc
              .getElementById('total-time')
              .innerHTML = ""
          }
          else
          {
            doc
              .getElementById('current-time')
              .innerHTML = TH.helpers.formatTime(this.player.item_progress_ms)
            doc
              .getElementById('progress')
              .setAttribute("value", this.player.item_progress_ms / this.player.item_length_ms)
            doc
              .getElementById('total-time')
              .innerHTML = TH.helpers.formatTime(this.player.item_length_ms)
          }
          doc
            .getElementById('play-btn')
            .innerHTML = this.playerStateBadge(this.player.state)

          return true
        })
    }, 1000)

    doc
      .getElementById('output-btn')
      .addEventListener('select', () => {
        ATV.Navigation.navigate('outputs')
      })
  },
  player: null,
  playerStateBadge(state) {
    if (state == 'play')
      return '<badge src="' + TH.asset_url('img/pause.png') + '" width="96" height="96" />'
    else
      return '<badge src="' + TH.asset_url('img/play.png') + '" width="96" height="96" />'
  },
  queue: null
})

export default PlayingNowPage
