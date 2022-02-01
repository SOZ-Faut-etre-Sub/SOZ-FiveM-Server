<template>
    <body>
    <audio id="audio_on" src="mic_click_on.ogg"></audio>
    <audio id="audio_off" src="mic_click_off.ogg"></audio>
    <div v-if="voice.uiEnabled && voice.voiceModes.length" class="voiceInfo">
        <transition name="display">
            <svg v-if="voice.voiceMode === 0"><use xlink:href="sprite.svg#whisper"/></svg>
        </transition>
        <transition name="display">
            <svg v-if="voice.voiceMode === 1"><use xlink:href="sprite.svg#normal"/></svg>
        </transition>
        <transition name="display">
            <svg v-if="voice.voiceMode === 2"><use xlink:href="sprite.svg#shouting"/></svg>
        </transition>
    </div>
    </body>
</template>

<script>
import {reactive} from "vue";

export default {
    name: "App",
    setup() {
        const voice = reactive({
            uiEnabled: true,
            voiceModes: [],
            voiceMode: 0,
            radioChannel: 0,
            radioEnabled: true,
            usingRadio: false,
            talking: false,
        });

        // stops from toggling voice at the end of talking
        window.addEventListener("message", function (event) {
            const data = event.data;

            if (data.uiEnabled !== undefined) {
                voice.uiEnabled = data.uiEnabled
            }

            if (data.voiceModes !== undefined) {
                voice.voiceModes = JSON.parse(data.voiceModes);
                // Push our own custom type for modes that have their range changed
                let voiceModes = [...voice.voiceModes]
                voiceModes.push([0.0, "Custom"])
                voice.voiceModes = voiceModes
            }

            if (data.voiceMode !== undefined) {
                voice.voiceMode = data.voiceMode;
            }

            if (data.radioChannel !== undefined) {
                voice.radioChannel = data.radioChannel;
            }

            if (data.radioEnabled !== undefined) {
                voice.radioEnabled = data.radioEnabled;
            }

            if (data.usingRadio !== undefined && data.usingRadio !== voice.usingRadio) {
                voice.usingRadio = data.usingRadio;
            }

            if ((data.talking !== undefined) && !voice.usingRadio) {
                voice.talking = data.talking;
            }

            if (data.sound && voice.radioEnabled && voice.radioChannel !== 0) {
                let click = document.getElementById(data.sound);
                // discard these errors as its usually just a 'uncaught promise' from two clicks happening too fast.
                click.load();
                click.volume = data.volume;
                click.play().catch((e) => {
                });
            }
        });

        fetch(`https://${GetParentResourceName()}/uiReady`, {method: 'POST'});

        return {voice};
    }
};
</script>

<style>
.voiceInfo {
    position: fixed;
    right: 13vw;
    bottom: 1.5rem;
    color: rgba(255, 255, 255, .75);
}

.voiceInfo svg {
    opacity: 0;
    width: 3rem;
    height: 3rem;
}

.display-enter-active {
    animation: display-in 3s;
}

@keyframes display-in {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>
