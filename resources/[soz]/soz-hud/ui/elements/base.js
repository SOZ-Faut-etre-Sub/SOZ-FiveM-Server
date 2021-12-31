/**
 * Component used to listen dataset update
 */
class SozUiElement extends HTMLElement {
  constructor() {
    super()

    this.root = this
    this.value = this.dataset.value
  }

  static get observedAttributes() {
    return ['data-value'];
  }

  connectedCallback() {
    this.renderHTMLComponent()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    this.value = newValue
    this.renderHTMLComponent()
  }

  renderHTMLComponent() {
    /** Implement yourself **/
  }
}