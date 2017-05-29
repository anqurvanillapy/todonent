# TODOnent

> Vanilla JS is awesome!

Minimal TODO app with Web Components.

## Notes

### Encapsulate CSS with `<template>`

There is a helper to wrap the `<style>` of a component, by temporarily creating
an element `<template>` and then `importNode`-ing the template to generate a
`#document-fragment`, so some properties now could be bound to the views by
simply using `document.getElementById`, and the style inside will be activated
in the Shadow DOM.

```js
let wrapFn = text => {
    let tmpl = document.createElement('template')
    tmpl.innerHTML = text
    return document.importNode(tmpl.content, true)
}

// Using <style> made easy now.
let elem = wrapFn`
  <style>
  p { color: #666; }
  </style>
  <p>'Ello, guv'nor.</p>`
```

## License

ISC
