const Targeting = Vue.createApp({
    data() {
        return {
            Show: false,
            ChangeTextIconColor: false, // This is if you want to change the color of the icon next to the option text with the text color
            StandardEyeIcon: "far fa-eye",
            CurrentIcon: "far fa-eye",
            SuccessColor: "rgb(30, 144, 255)",
            StandardColor: "white",
            TargetHTML: "",
            TargetEyeStyleObject: {
                color: "white", // This is the standardcolor, change this to the same as the StandardColor if you have changed it
            },
        }
    },
    destroyed() {
        window.removeEventListener("message", this.messageListener);
        window.removeEventListener("mousedown", this.mouseListener);
        window.removeEventListener("keydown", this.keyListener);
    },
    mounted() {
        this.messageListener = window.addEventListener("message", (event) => {
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
        });

        this.mouseListener = window.addEventListener("mousedown", (event) => {
            let element = event.target;
            let split = element.id.split("-");
            if (split[0] === 'target' && split[1] !== 'eye') {
                fetch(`https://${GetParentResourceName()}/selectTarget`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8', },
                    body: JSON.stringify(Number(split[1]) + 1)
                }).then(resp => resp.json()).then(resp => {});
                this.TargetHTML = "";
                this.Show = false;
            }

            if (event.button == 2) {
                this.CloseTarget();
                fetch(`https://${GetParentResourceName()}/closeTarget`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8', },
                    body: ''
                }).then(resp => resp.json()).then(resp => {});
            }
        });

        this.keyListener = window.addEventListener("keydown", (event) => {
            if (event.key == 'Escape' || event.key == 'Backspace') {
                this.CloseTarget();
                fetch(`https://${GetParentResourceName()}/closeTarget`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8', },
                    body: ''
                }).then(resp => resp.json()).then(resp => {});
            }
        });
    },
    methods: {
        OpenTarget() {
            this.TargetHTML = "";
            this.Show = true;
            this.TargetEyeStyleObject.color = this.StandardColor;
        },

        CloseTarget() {
            this.TargetHTML = "";
            this.TargetEyeStyleObject.color = this.StandardColor;
            this.Show = false;
            this.CurrentIcon = this.StandardEyeIcon;
        },

        FoundTarget(item) {
            if (item.data) {
                this.CurrentIcon = item.data;
            } else {
                this.CurrentIcon = this.StandardEyeIcon;
            }
            this.TargetEyeStyleObject.color = this.SuccessColor;
        },

        ValidTarget(item) {
            this.TargetHTML = "";
            let TargetLabel = this.TargetHTML;
            const FoundColor = this.SuccessColor;
            const ResetColor = this.StandardColor;
            const AlsoChangeTextIconColor = this.ChangeTextIconColor;
            item.data.forEach(function(item, index) {
                if (AlsoChangeTextIconColor) {
                    TargetLabel += "<div id='target-" + index + "' style='margin-bottom: 1vh;'><span id='target-icon-" + index + "' style='color: " + ResetColor + "'><i class='" + item.icon + "'></i></span>&nbsp" + item.label + "</div>";
                } else {
                    TargetLabel += "<div id='target-" + index + "' style='margin-bottom: 1vh;'><span id='target-icon-" + index + "' style='color: " + FoundColor + "'><i class='" + item.icon + "'></i></span>&nbsp" + item.label + "</div>";
                };

                setTimeout(function() {
                    const hoverelem = document.getElementById("target-" + index);

                    hoverelem.addEventListener("mouseenter", function(event) {
                        event.target.style.color = FoundColor;
                        if (AlsoChangeTextIconColor) {
                            document.getElementById("target-icon-" + index).style.color = FoundColor;
                        };
                    });

                    hoverelem.addEventListener("mouseleave", function(event) {
                        event.target.style.color = ResetColor;
                        if (AlsoChangeTextIconColor) {
                            document.getElementById("target-icon-" + index).style.color = ResetColor;
                        };
                    });
                }, 10)
            });
            this.TargetHTML = TargetLabel;
        },

        LeftTarget() {
            this.TargetHTML = "";
            this.CurrentIcon = this.StandardEyeIcon;
            this.TargetEyeStyleObject.color = this.StandardColor;
        }
    }
});

Targeting.use(Quasar, { config: {} });
Targeting.mount("#target-wrapper");
