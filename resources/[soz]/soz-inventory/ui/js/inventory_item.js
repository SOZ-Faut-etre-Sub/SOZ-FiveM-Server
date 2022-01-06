class InventoryItem extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="inv-item">
            <div class="icon"></div>
            <div class="label">${this.dataset.amount} ${this.dataset.label}</div>
            <span class="tooltip">${this.dataset.description}</span>
        </div>
    `
  }
}

customElements.define('inventory-item', InventoryItem)