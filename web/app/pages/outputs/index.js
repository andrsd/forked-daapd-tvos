import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/api.js'
import TH from 'lib/template-helpers.js'

const OutputsPage = ATV.Page.create({
  name: 'outputs',
  template: template,
  ready (options, resolve, reject) {
    let outputs = API.get(API.url.outputs())

    Promise
      .all([outputs])
      .then((xhrs) => {
        this.outputs = {}
        for (let o of xhrs[0].response.outputs) {
          this.outputs[o.id] = o
        }

        resolve({
          outputs: xhrs[0].response.outputs,
        })
      }, (xhrs) => {
        reject()
      })
  },
  afterReady(doc) {
    for (const id in this.outputs) {
      doc
        .getElementById(id)
        .addEventListener('select', () => {
          let state = !this.outputs[id].selected
          API
            .put(API.url.output(id), { selected: state })
            .then(() => {
              this.outputs[id].selected = state
              return true
            }, (xhr) => {
              return false
            })
        })
    }
  },
  outputs: {}
})

export default OutputsPage
