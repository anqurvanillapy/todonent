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
    let containerStyle =
    `border: solid 1px #999;
    border-radius: 3px;`

    let container = document.createElement('div')
    container.textContent = 'Hello, Web Components!'
    container.setAttribute('style', containerStyle)
    this.shadowRoot.appendChild(container)
  }
}

class TodoItem extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})
  }
}

customElements.define('todo-app', TodoApp)
