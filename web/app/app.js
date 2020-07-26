// ruby -run -ehttpd . -p9010
// npm start

import ATV from 'atvjs'

// template helpers
import 'lib/template-helpers'
// raw css string
import css from 'assets/css/app.css'
// shared templates
import loaderTpl from 'shared/templates/loader.hbs'
import errorTpl from 'shared/templates/error.hbs'

// pages
import PlayingNowPage from 'pages/playing-now'
import AlbumsPage from 'pages/albums'
import AlbumTracksPage from 'pages/album-tracks'
import ArtistsPage from 'pages/artists'
import ArtistAlbumsPage from 'pages/artist-albums'
import GenresPage from 'pages/genres'
import AudiobooksPage from 'pages/audiobooks'
import SearchPage from 'pages/search'

ATV.start({
  style: css,
  menu: {
    items: [{
      id: 'playing-now',
      name: 'Now Playing',
      page: PlayingNowPage,
      attributes: { autoHighlight: true, reloadOnSelect: true }
    },{
      id: 'albums',
      name: 'Albums',
      page: AlbumsPage,
      attributes: { reloadOnSelect: true }
    },{
      id: 'artists',
      name: 'Artists',
      page: ArtistsPage,
      attributes: { reloadOnSelect: true }
    },{
      id: 'genres',
      name: 'Genres',
      page: GenresPage,
      attributes: { reloadOnSelect: true }
    },{
      id: 'audiobooks',
      name: 'Audiobooks',
      page: AudiobooksPage,
      attributes: { reloadOnSelect: true }
    },{
      id: 'search',
      name: 'Search',
      page: SearchPage,
      attributes: { reloadOnSelect: true }
    }]
  },
  templates: {
    loader: loaderTpl,
    error: errorTpl,
    // status level error handlers
    status: {
      '404': () => errorTpl({
        title: '404',
        message: 'Page was not found!'
      }),
      '500': () => errorTpl({
        title: '500',
        message: 'Unknown error. Try it again later.'
      }),
      '503': () => errorTpl({
        title: '503',
        message: 'Unknown error. Try it again later.'
      })
    }
  },
  onLaunch (options) {
    ATV.Menu.setOptions({
      loadingMessage: 'Loading'
    })
    ATV.Navigation.navigateToMenuPage()
  },
  onResume (options) {
    // ATV.Navigation.clear()
    // ATV.Navigation.navigateToMenuPage()
  }
})
