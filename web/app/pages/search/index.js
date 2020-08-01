import ATV from 'atvjs'

import template from './template.hbs'
import searchTpl from './search.hbs'
import noResultsTpl from './noresults.hbs'
import context_menu from './context-menu.hbs'

import API from 'lib/api.js'

function buildResults(doc, searchText) {
  // Create parser and new input element
  var domImplementation = doc.implementation;
  var lsParser = domImplementation.createLSParser(1, null);
  var lsInput = domImplementation.createLSInput();

  // set default template fragment to display no results
  lsInput.stringData = ``;

  if (searchText) {
    let query = encodeURIComponent(searchText)

    let searchMusic = API.get(API.url.search({query: query, type: 'album,track', media_kind: 'music' }))
    let searchAudiobooks = API.get(API.url.search({query: query, type: 'album', media_kind: 'audiobook' }))
    let searchArtists = API.get(API.url.search({query: query, type: 'artist' }))

    Promise
      .all([searchMusic, searchAudiobooks, searchArtists])
      .then((xhrs) => {
        var obj = {}
        if (xhrs[0].response.albums.total > 0)
          obj.albums = xhrs[0].response.albums.items
        if (xhrs[0].response.tracks.total > 0)
          obj.tracks = xhrs[0].response.tracks.items
        if (xhrs[1].response.albums.total > 0)
          obj.audiobooks = xhrs[1].response.albums.items
        if (xhrs[2].response.artists.total > 0)
          obj.artists = xhrs[2].response.artists.items

        //overwrite stringData for new input element if search results exist by dynamically constructing shelf template fragment
        lsInput.stringData = searchTpl(obj);

        //add the new input element to the document by providing the newly created input, the context,
        //and the operator integer flag (1 to append as child, 2 to overwrite existing children)
        lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
        resolve()
      }, (xhrs) => {
        // error
        reject()
      })
  }
  else {
    lsInput.stringData = noResultsTpl();
    lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
  }
}

const SearchPage = ATV.Page.create({
  name: 'search',
  template: template,
  events: {
    holdselect: 'onHoldSelect'
  },
  afterReady(doc) {
    let searchField = doc.getElementsByTagName('searchField').item(0);
    let keyboard = searchField && searchField.getFeature('Keyboard');

    if (keyboard) {
      keyboard.onTextChange = function() {
        let searchText = keyboard.text;
        console.log(`search text changed: ${searchText}`);
        buildResults(doc, searchText);
      };
    }
  },
  onHoldSelect(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'lockup') {
      var item = JSON.parse(element.getAttribute("data-href-page-options"))
      var data

      if ('name' in item && 'artist' in item) {
        data = {
          title: item.name,
          subtitle: item.artist
        }
      }
      else if ('name' in item) {
        data = {
          title: item.name
        }
      }
      else if ('artist' in item && 'album' in item) {
        data = {
          title: item.title,
          subtitle: item.artist
        }
      }

      var doc = ATV.Navigation.presentModal({
        template: context_menu,
        data: data
      })

      doc
        .getElementById('add-btn')
        .addEventListener('select', () => {
          API
            .post(API.url.queueAddItems([item.uri]))
            .then(() => {
              ATV.Navigation.dismissModal()
              return true
            })
        })
      doc
        .getElementById('play-btn')
        .addEventListener('select', () => {
          API
            .put(API.url.queueClear())
            .then(() => {
              return API.post(API.url.queueAddItems([item.uri]))
            })
            .then(() => {
              return API.put(API.url.playerPlay())
            })
            .then(() => {
              ATV.Navigation.dismissModal()
              return true
            })
        })
    }
  },
})

export default SearchPage
