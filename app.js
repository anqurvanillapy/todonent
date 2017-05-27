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
    let todoBox = document.createElement('template')
    todoBox.innerHTML =
    `<style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .container {
        padding: 2px;
        border: solid 1px #999;
        border-radius: 2px;
      }
      </style>
      <div class="container">
        <input type="text" name="entry">
        <button type="button">Add</button>
      </div>`

    this.shadowRoot.appendChild(document.importNode(todoBox.content, true))
  }
}

class TodoItem extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
  }
}

customElements.define('todo-app', TodoApp)
