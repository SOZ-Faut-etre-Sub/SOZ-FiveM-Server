class VehicleFuel extends SozUiElement {
  renderHTMLComponent() {
    if (this.root.innerHTML.indexOf('svg') !== -1) { // Check if component is already render
      const gauge = this.root.querySelector('.progress')
      gauge.style.strokeDashoffset = `${100 - this.value}`

      if (this.value <= 25) {
        gauge.style.stroke = 'rgb(255,2,69)'
      } else if (this.value <= 35) {
        gauge.style.stroke = 'rgb(255,175,2)'
      } else {
        gauge.style.stroke = 'rgb(255,255,255)'
      }

    } else {
      this.root.innerHTML = `
        <svg class="fuel" width="50" height="50">
          <path 
            d="M8.43982 33C4.50943 29.7974 2 24.9236 2 19.4648C2 9.81925 9.83502 2 19.5 2C29.165 2 37 9.81925 37 19.4648C37 24.9236 34.4906 29.7974 30.5602 33" 
            fill="none" 
            stroke="white" 
            stroke-width="3" 
            stroke-opacity="0.2"/>
          <path 
            d="M8.43982 33C4.50943 29.7974 2 24.9236 2 19.4648C2 9.81925 9.83502 2 19.5 2C29.165 2 37 9.81925 37 19.4648C37 24.9236 34.4906 29.7974 30.5602 33" 
            class="progress" 
            fill="none" 
            stroke="white" 
            stroke-width="3" 
            stroke-opacity="0.6"
            stroke-dasharray="100"
            style="stroke-dashoffset: ${100 - this.value}" />
    
          <g opacity="1" clip-path="url(#clip0)">
            <path d="M9.2084 4.27568V1.82575V1.59168V0.920676C9.2084 0.795839 9.09531 0.686606 8.96607 0.686606C8.83683 0.686606 8.72375 0.795839 8.72375 0.920676V1.56047C8.65913 1.90377 8.43296 2.85566 8.01292 3.24577C7.96446 3.29259 7.9483 3.35501 7.9483 3.41743V3.90117C7.9483 4.02601 8.06139 4.13524 8.19063 4.13524H8.72375V4.44733V4.46294C8.72375 4.58778 8.83683 4.69701 8.96607 4.69701C9.27302 4.69701 9.51535 4.93108 9.51535 5.22757V9.58127C9.51535 9.87776 9.27302 10.1118 8.96607 10.1118C8.65913 10.1118 8.4168 9.87776 8.4168 9.58127V8.20806C8.4168 8.08322 8.30371 7.97399 8.17447 7.97399H7.67367V4.43173C7.67367 4.22887 7.57674 4.04161 7.4475 3.91677V0.905072C7.4475 0.405722 7.02746 0 6.5105 0H1.69628C1.17932 0 0.759289 0.405722 0.759289 0.905072V3.91677C0.613893 4.04161 0.533118 4.22887 0.533118 4.43173V11.5319H0.242326C0.113086 11.5319 0 11.6411 0 11.7659C0 11.8908 0.113086 12 0.242326 12H0.759289H7.1567H7.9483C8.07754 12 8.19063 11.8908 8.19063 11.7659C8.19063 11.6411 8.07754 11.5319 7.9483 11.5319H7.65751V8.45774H7.91599V9.59688C7.91599 10.143 8.38449 10.5956 8.94992 10.5956C9.51535 10.5956 9.98384 10.143 9.98384 9.59688V5.24317C10 4.77503 9.66074 4.36931 9.2084 4.27568ZM1.69628 0.780234H6.5105C6.57512 0.780234 6.63974 0.842653 6.63974 0.905072V3.72952H1.56704V0.905072C1.56704 0.842653 1.63166 0.780234 1.69628 0.780234Z" fill="white"/>
          </g>
        </svg>
      `
    }
  }
}

/**
 * Component used to display vehicle fuel on UI
 */
class VehicleSpeed extends SozUiElement {
  renderHTMLComponent() {
    const speed = this.value > 200 ? 200 : this.value

    if (this.root.innerHTML.indexOf('svg') !== -1) { // Check if component is already render
      this.root.querySelector('.progress').style.strokeDashoffset = `-${200 - speed}`
      this.root.querySelector('span.speed').textContent = this.value
    } else {
      this.root.innerHTML = `
        <svg class="speed" width="100" height="100">
          <path 
            d="M92 47.0775C92 22.1819 71.8528 2 47 2C22.1472 2 2 22.1819 2 47.0775C2 61.1597 8.44627 73.7337 18.5441 82" 
            fill="none" 
            stroke="white" 
            stroke-width="4" 
            stroke-opacity="0.2"/>
          <path 
            d="M92 47.0775C92 22.1819 71.8528 2 47 2C22.1472 2 2 22.1819 2 47.0775C2 61.1597 8.44627 73.7337 18.5441 82" 
            class="progress" 
            fill="none" 
            stroke="url(#gradient)" 
            stroke-width="4" 
            stroke-opacity="0.6"
            stroke-dasharray="200"
            style="stroke-dashoffset: -${200 - speed}" />
          <defs>
            <linearGradient id="gradient">
              <stop offset="30%" stop-color="#BBFFFE"/>
              <stop offset="100%" stop-color="#FF0245"/>
            </linearGradient>
          </defs>
        </svg>
        <div class="display">
            <span class="speed">${this.value}</span>
            <span>km/h</span>
        </div>
      `
    }
  }
}

/**
 * Component used to display light state on UI
 */
class VehicleLight extends SozUiElement {
  renderHTMLComponent() {
    switch (this.value) {
      case '0':
        this.root.innerHTML = `
          <svg>
            <use xlink:href="sprite.svg#low-beam"/>
          </svg>
        `
        break
      case '1':
        this.root.innerHTML = `
          <svg style="color: #2ecc71">
            <use xlink:href="sprite.svg#low-beam"/>
          </svg>
        `
        break
      case '2':
        this.root.innerHTML = `
          <svg style="color: #0984e3">
            <use xlink:href="sprite.svg#high-beam"/>
          </svg>
        `
        break
    }
  }
}

customElements.define('vehicle-fuel', VehicleFuel)
customElements.define('vehicle-speed', VehicleSpeed)
customElements.define('vehicle-light', VehicleLight)
