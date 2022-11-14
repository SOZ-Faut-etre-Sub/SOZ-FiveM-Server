const generateItem = function(index, item) {
  let iconHTML = '';

  if (item.icon === undefined) {
    iconHTML = `<i class="fas fa-question" data-id="${index}"></i>`
  } else if (item.icon.startsWith('c:')) {
    iconHTML = `<img src="/html/img/${item.icon.substring(2)}" data-id="${index}" alt="" />`
  } else {
    iconHTML = `<i class="${item.icon}" data-id="${index}"></i>`
  }

  return `
        <div class="target-item ${item.color}" data-id="${index}">
            <span class="tooltip" data-id="${index}">${item.label}</span>
            <span class="icon" data-id="${index}">${iconHTML}</span>
        </div>
      `;
}

const removeTargetItems = function (targets) {
  targets.forEach(function (element) {
    element.style.transform = `scale(0) translateY(0) translateX(0)`
    element.style.transitionDelay = '0s'
    element.style.opacity = '0'
  });
}

const Targeting = Vue.createApp({
  data() {
    return {
      Show: false,
      ChangeTextIconColor: false, // This is if you want to change the color of the icon next to the option text with the text color
      StandardEyeIcon: "do_not_touch",
      SuccessEyeIcon: "pan_tool",
      CurrentIcon: "do_not_touch",
      SuccessColor: "rgba(255,255,255,.6)",
      StandardColor: "rgba(255,255,255,.25)",
      TargetHTML: "",
      TargetEyeStyleObject: {
        color: "rgba(255,255,255,.25)", // This is the standardcolor, change this to the same as the StandardColor if you have changed it
      },
    }
  },
  destroyed() {
    window.removeEventListener("message", this.messageListener);
    window.removeEventListener("mousedown", this.mouseListener);
    window.removeEventListener("keydown", this.keyListener);
  },
  mounted() {
    this.messageListener = (event) => {
      switch (event.data.response) {
        case "openTarget":
          this.OpenTarget();
          break;
        case "closeTarget":
          this.CloseTarget();
          break;
        case "foundTarget":
          this.FoundTarget(event.data);
          break;
        case "validTarget":
          this.ValidTarget(event.data);
          break;
        case "leftTarget":
          this.LeftTarget();
          break;
      }
    };

    this.mouseListener = (event) => {
      let element = event.target;
      if (element.dataset.id) {
        fetch(`https://${GetParentResourceName()}/selectTarget`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json; charset=UTF-8',},
          body: JSON.stringify(Number(element.dataset.id) + 1)
        }).then(() => {
          this.TargetHTML = "";
          this.Show = false;
        });
      }

      if (event.button === 2) {
        fetch(`https://${GetParentResourceName()}/closeTarget`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json; charset=UTF-8',},
          body: ''
        }).then(() => {
          this.CloseTarget();
        });
      }
    };

    this.keyListener = (event) => {
      if (event.key === 'Escape' || event.key === 'Backspace') {
        fetch(`https://${GetParentResourceName()}/closeTarget`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json; charset=UTF-8',},
          body: ''
        }).then(() => {
          this.CloseTarget();
        });
      }
    };

    window.addEventListener("message", this.messageListener);
    window.addEventListener("mousedown", this.mouseListener);
    window.addEventListener("keydown", this.keyListener);
  },
  methods: {
    OpenTarget() {
      const targets = document.querySelectorAll('.target-item')
      removeTargetItems(targets);

      setTimeout(() => {
        this.TargetHTML = "";
        this.Show = true;
        this.TargetEyeStyleObject.color = this.StandardColor;
      }, targets.length > 0 ? 200 : 0);
    },

    CloseTarget() {
      const targets = document.querySelectorAll('.target-item')
      removeTargetItems(targets);

      setTimeout(() => {
        this.TargetHTML = "";
        this.TargetEyeStyleObject.color = this.StandardColor;
        this.Show = false;
        this.CurrentIcon = this.StandardEyeIcon;
      }, targets.length > 0 ? 200 : 0);
    },

    FoundTarget(items) {
      const targets = document.querySelectorAll('.target-item')
      removeTargetItems(targets);

      setTimeout(() => {
        this.TargetEyeStyleObject.color = this.SuccessColor;
        this.TargetHTML = "";
        let TargetLabel = this.TargetHTML;
        this.CurrentIcon = this.SuccessEyeIcon;

        items.data.sort((a, b) => {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        });

        items.data.forEach(function (item, index) {
          let left = Math.cos(index / items.data.length * Math.PI * 2).toFixed(6);
          let top = Math.sin(index / items.data.length * Math.PI * 2).toFixed(6);

          TargetLabel += generateItem(index, item);

          setTimeout(() => {
            const element = document.querySelector(`div.target-item[data-id="${index}"]`);
            if (element === null) return;

            element.style.transform = `scale(1) translateY(calc(120px * ${top})) translateX(calc(120px * ${left}))`
            element.style.transitionDelay = `${index * .015}s`
            element.style.opacity = '1'
          }, 200)
        });
        this.TargetHTML = TargetLabel;
      }, targets.length > 0 ? 200 : 0);
    },

    ValidTarget(items) {
      this.TargetHTML = "";
      let TargetLabel = this.TargetHTML;

      items.data.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
      items.data.forEach(function (item, index) {
        TargetLabel += generateItem(index, item);
      });
      this.TargetHTML = TargetLabel;
    },

    LeftTarget() {
      const targets = document.querySelectorAll('.target-item')
      removeTargetItems(targets);

      setTimeout(() => {
        this.TargetHTML = "";
        this.CurrentIcon = this.StandardEyeIcon;
        this.TargetEyeStyleObject.color = this.StandardColor;
      }, targets.length > 0 ? 200 : 0);
    }
  }
});

Targeting.use(Quasar, {config: {}});
Targeting.mount("#app");
