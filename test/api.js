import API from '../web/app/lib/api.js'

var expect = require('chai').expect;


describe('API', function () {
  describe('url', function () {
    var base_url = 'http://10.0.0.1:3689'
    var base_api = `${base_url}/api`
    it('artists', function(done) {
      expect(API.url.artists()).to.equal(`${base_api}/library/artists`)
      done()
    })
    it('artist albums', function(done) {
      expect(API.url.artistAlbums('123')).to.equal(`${base_api}/library/artists/123/albums`)
      done()
    })
    it('albums', function(done) {
      expect(API.url.albums()).to.equal(`${base_api}/search?query=&type=album&media_kind=music`)
      done()
    })
    it('album', function(done) {
      expect(API.url.album('123')).to.equal(`${base_api}/library/albums/123`)
      done()
    })
    it('album tracks', function(done) {
      expect(API.url.albumTracks('123')).to.equal(`${base_api}/library/albums/123/tracks`)
      done()
    })
    it('genres', function(done) {
      expect(API.url.genres()).to.equal(`${base_api}/library/genres`)
      done()
    })
    it('genreAlbums', function(done) {
      expect(API.url.genreAlbums('rock')).to.equal(`${base_api}/search?type=albums&expression=genre%20is%20%22rock%22`)
      done()
    })
    it('audiobooks', function(done) {
      expect(API.url.audiobooks()).to.equal(`${base_api}/search?query=&type=album&media_kind=audiobook`)
      done()
    })
    it('search query', function(done) {
      expect(API.url.search({type: 'type', query: 'query'})).to.equal(`${base_api}/search?type=type&query=query`)
      done()
    })
    it('search media kind', function(done) {
      expect(API.url.search({type: 'type', media_kind: 'music'})).to.equal(`${base_api}/search?type=type&media_kind=music`)
      done()
    })
    it('search expression', function(done) {
      expect(API.url.search({type: 'type', expression: 'expr'})).to.equal(`${base_api}/search?type=type&expression=expr`)
      done()
    })
    it('queue', function(done) {
      expect(API.url.queue()).to.equal(`${base_api}/queue`)
      done()
    })
    it('queue clear', function(done) {
      expect(API.url.queueClear()).to.equal(`${base_api}/queue/clear`)
      done()
    })
    it('queue add 1 item', function(done) {
      expect(API.url.queueAddItems(['1'])).to.equal(`${base_api}/queue/items/add?uris=1`)
      done()
    })
    it('queue add 2 items', function(done) {
      expect(API.url.queueAddItems(['1', '2'])).to.equal(`${base_api}/queue/items/add?uris=1,2`)
      done()
    })
    it('player', function(done) {
      expect(API.url.player()).to.equal(`${base_api}/player`)
      done()
    })
    it('player previous track', function(done) {
      expect(API.url.playerPreviousTrack()).to.equal(`${base_api}/player/previous`)
      done()
    })
    it('player next track', function(done) {
      expect(API.url.playerNextTrack()).to.equal(`${base_api}/player/next`)
      done()
    })
    it('player play', function(done) {
      expect(API.url.playerPlay()).to.equal(`${base_api}/player/play`)
      done()
    })
    it('player pause', function(done) {
      expect(API.url.playerPause()).to.equal(`${base_api}/player/pause`)
      done()
    })
    it('player stop', function(done) {
      expect(API.url.playerStop()).to.equal(`${base_api}/player/stop`)
      done()
    })
    it('artwork URL', function(done) {
      expect(API.url.artworkUrl('/a/b/1.png')).to.equal(`${base_url}/a/b/1.png`)
      done()
    })
  })
});
