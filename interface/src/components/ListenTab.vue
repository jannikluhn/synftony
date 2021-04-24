<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-narrow">
            <div ref="target"></div>
          </div>
        </div>
        <div :id="domID"></div>
      </div>
    </section>
  </div>
</template>

<script>
import abcjs from "abcjs";

const visualOptions = {
  displayLoop: true,
  displayRestart: true,
  displayPlay: true,
  displayProgress: true,
  displayWarp: false,
};

export default {
  name: "ListenTab",
  props: ["abc"],

  data() {
    return {
      synthController: null,
    };
  },

  computed: {
    domID() {
      return "abcjs-player-".concat(this._uid);
    },
  },

  watch: {
    abc() {
      const visualObj = abcjs.renderAbc(this.$refs.target, this.abc, {
        wrap: {
          minSpacing: 4,
        },
      });

      this.synthController.disable(true);
      const params = {
        options: {
          visualObj: visualObj,
        },
      };
      this.synthController.setTune(visualObj[0], false, params);
    },
  },

  mounted() {
    this.synthController = new abcjs.synth.SynthController();
    this.synthController.load("#".concat(this.domID), {}, visualOptions);
  },
};
</script>
