import ATV from 'atvjs'
import template from './template.hbs'
import albumsTpl from './albums.hbs'
import context_menu from './context-menu.hbs'
import API from 'lib/api.js'

const GenresPage = ATV.Page.create({
  name: 'genres',
  template: template,
  events: {
    highlight: 'onHighlight',
    holdselect: 'onHoldSelect'
  },
  ready (options, resolve, reject) {
    API
      .get(API.url.genres())
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
  },
  onHighlight(e) {
    let element = e.target
    let elementType = element.nodeName.toLowerCase()

    if (elementType === 'listitemlockup') {
      this.loadAlbums(element)
    }
  },
  loadAlbums (element) {
    var genre = element.getElementsByTagName("title").item(0).textContent

    var doc = getActiveDocument()
    // Create parser and new input element
    var domImplementation = doc.implementation
    var lsParser = domImplementation.createLSParser(1, null)
    var lsInput = domImplementation.createLSInput()

    let getGenreAlbums = API.get(API.url.genreAlbums(genre))

    Promise
      .all([getGenreAlbums])
      .then((xhrs) => {
        let results = xhrs[0].response

        //overwrite stringData for new input element if search results exist by dynamically constructing shelf template fragment
        lsInput.stringData = albumsTpl({
          albums: results.albums.items
        })

        //add the new input element to the document by providing the newly created input, the context,
        //and the operator integer flag (1 to append as child, 2 to overwrite existing children)
        lsParser.parseWithContext(lsInput, element.getElementsByTagName("relatedContent").item(0), 2)

      }, (xhrs) => {
        // error
        reject()
      })
  },
  onHoldSelect(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'lockup') {
      var album = JSON.parse(element.getAttribute("data-href-page-options"))
      var doc = ATV.Navigation.presentModal({
        template: context_menu,
        data: {
          album: album.name,
          artist: album.artist
        }
      })

      doc
        .getElementById('add-btn')
        .addEventListener('select', () => {
          API
            .post(API.url.queueAddItems([album.uri]))
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
              return API.post(API.url.queueAddItems([album.uri]))
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

export default GenresPage
