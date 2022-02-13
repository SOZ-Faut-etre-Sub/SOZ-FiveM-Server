/**
 * Component used to manage player need unitary, with update logic
 * @param data-type used to force display hunger and thirst even if value id 0
 * @param data-value representation in percentage of the completion of the need
 */
class PlayerNeed extends SozUiElement {
  constructor() {
    super()

    this.type = this.dataset.type
  }

  renderHTMLComponent() {
    if ((this.value > 0 && (this.type !== 'hunger' || this.type !== 'thirst')) && ((this.type === 'hunger' || this.type === 'thirst') && this.value <= 50)) {
      if (this.root.innerHTML.indexOf('status') !== -1) { // Check if component is already render
        this.root.querySelector('.progressbar .progress').style.width = `${this.value}%`
      } else {
        this.root.innerHTML = `
          <div class="status">
            <svg class="icon">
              <use xlink:href="sprite.svg#${this.type}"/>
            </svg>
            <div class="progressbar ${this.type}">
              <div class="progress ${this.type}" style="width: ${this.value}%" />
            </div>
          </div>
        `
      }
    } else {
      this.root.innerHTML = '' // Delete html content if value is 0
    }
  }
}

customElements.define('player-need', PlayerNeed)
