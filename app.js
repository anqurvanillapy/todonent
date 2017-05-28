let wrapFn = text => {
  let tmpl = document.createElement('template')
  tmpl.innerHTML = text
  return document.importNode(tmpl.content, true)
}

class TodoApp extends HTMLElement {
  constructor () {
    super()
    this._nitem = 0
    this.attachShadow({mode: 'open'})
  }

  static get observedAttributes () { return ['nitem'] }
  attributeChangedCallback (attr, oldValue, newValue) {
    if (oldValue !== newValue) this[attr] = newValue
  }

  get nitem () { return this._nitem }
  set nitem (value) {
    if (value !== this._nitem) {
      this._nitem = parseInt(value)
      this.setAttribute('nitem', value)
      // this.display()
    }
  }

  connectedCallback () { this.render() }

  render () {
    let todoBox = wrapFn`
      <style>
      * {
        box-sizing: border-box;
      }

      header h1 {
        color: #ccc;
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }

      .todobox {
        padding: .5em;
        border: solid 1px #ccc;
        box-shadow: 3px 3px #999;
      }
        .todobox > * { font-size: 1.5em; }
        .todobox > input { width: 90%; }
      </style>
      <header><h1>Todos</h1></header>
      <div class="todobox">
        <input id="entry" type="text">
        <button id="add" type="button">+</button>
      </div>`

    // Listeners.
    let entry = todoBox.getElementById('entry')
    todoBox.getElementById('add').addEventListener('click', _ => {
      if (!entry.value) return
      console.log(entry.value)
    })

    this.shadowRoot.appendChild(todoBox)
  }
}

class TodoItem extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
  }

  connectedCallback () { this.render() }

  render () { }
}

customElements.define('todo-app', TodoApp)
customElements.define('todo-item', TodoItem)
