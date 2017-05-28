let wrapFn = text => {
  let tmpl = document.createElement('template')
  tmpl.innerHTML = text
  return document.importNode(tmpl.content, true)
}

class TodoApp extends HTMLElement {
  constructor () {
    super()
    this._nitem = 0
    this._done = 0
    this.attachShadow({mode: 'open'})
  }

  static get observedAttributes () { return ['nitem', 'done'] }
  attributeChangedCallback (attr, oldValue, newValue) {
    if (oldValue !== newValue) this[attr] = newValue
  }

  get nitem () { return this._nitem }
  set nitem (value) {
    if (value !== this._nitem) {
      this._nitem = parseInt(value)
      this.setAttribute('nitem', value)
      this.updateStatusbar()
    }
  }

  get done () { return this._done }
  set done (value) {
    if (value !== this._done) {
      this._done = parseInt(value)
      this.setAttribute('done', value)
      this.updateStatusbar()
    }
  }

  connectedCallback () { this.render() }

  render () {
    let todoBox = wrapFn`
      <style>
      header h1 {
        color: #ccc;
        text-align: center;
      }

      #todobox {
        padding: .5em;
        border: solid 1px #ccc;
        border-radius: 3px;
        box-shadow: 0px 4px 5px #999;
        display: flex;
        justify-content: space-around;
      }
        #todobox > * { font-size: 1.5em; }
        #todobox > input { width: 90%; }
      </style>
      <header><h1>Todos</h1></header>
      <div id="todobox">
        <input id="entry" type="text">
        <button id="add" type="button">+</button>
      </div>
      <p id="statusbar"></p>`

    // Prepare for data-binding.
    this.inputEntry = todoBox.getElementById('entry')
    this.btnAdd = todoBox.getElementById('add')
    this.statusbar = todoBox.getElementById('statusbar')

    // Listeners.
    this.btnAdd.addEventListener('click', _ => {
      if (!this.inputEntry.value) return

      let newItem = document.createElement('todo-item')
      newItem.setAttribute('val', this.inputEntry.value)

      ++this.nitem
      this.inputEntry.value = ''

      document.body.appendChild(newItem)
    })

    this.shadowRoot.appendChild(todoBox)
  }

  updateStatusbar () {
    this.statusbar.textContent = `${this.done} / ${this.nitem} done.`
  }
}

class TodoItem extends HTMLElement {
  constructor () {
    super()
    this._val = ''
    this.attachShadow({mode: 'open'})
  }

  static get observedAttributes () { return ['val'] }
  attributeChangedCallback (attr, oldValue, newValue) {
    if (oldValue !== newValue) this[attr] = newValue
  }

  get val () { return this._val }
  set val (value) {
    if (value !== this._val) {
      this._val = value
      this.setAttribute('val', value)
      // Setting attributes might precede rendering.
      if (this.labelVal) this.updateDone()
    }
  }

  connectedCallback () { this.render() }

  render () {
    let todoItem = wrapFn`
      <style>
      .container {
        margin: 1em auto;
        padding: 1em;
        box-shadow: 0px 4px 5px #999;
      }
      </style>
      <div class="container">
        <button id="remove" type="button">&times;</button>
        <input id="done" type="checkbox">
        <label id="val" for="done"></label>
      </div>`

    this.btnRemove = todoItem.getElementById('remove')
    this.checkboxDone = todoItem.getElementById('done')
    this.labelVal = todoItem.getElementById('val')
    this.todoBox = document.querySelector('todo-app')

    this.checkboxDone.addEventListener('click', _ => {
      this.updateDone(this.checkboxDone.checked)
    })

    this.btnRemove.addEventListener('click', _ => {
      this.updateRemove(this.checkboxDone.checked)
    })

    this.labelVal.textContent = this.val
    this.shadowRoot.appendChild(todoItem)
  }

  updateDone (isDone) {
    // Update label.
    this.labelVal.style.textDecoration = isDone ? 'line-through' : 'none'

    // Update todo-app's statusbar.
    // FIXME: Not visible enough for a global change (todo-app).
    let done = parseInt(this.todoBox.done) || 0

    if (done) done = (isDone) ? ++done : --done
    if (!done && isDone) ++done
    this.todoBox.setAttribute('done', done)
  }

  updateRemove (isDone) {
    this.todoBox.setAttribute('nitem', parseInt(this.todoBox.nitem) - 1)
    if (isDone) {
      this.todoBox.setAttribute('done', parseInt(this.todoBox.done) - 1)
    }

    document.body.removeChild(this)
  }
}

customElements.define('todo-app', TodoApp)
customElements.define('todo-item', TodoItem)
