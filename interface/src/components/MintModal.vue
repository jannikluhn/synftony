<template>
  <div class="modal" :class="{'is-active': true}">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Mint Next Bar</p>
      </header>

      <section class="modal-card-body">
        <form>
          <div class="field">
            <label class="label">Notes in ABC notation</label>
            <input class="input" type="text" placeholder="" v-model="abcInput">
            <p v-if="!inputErrorMessage" class="help is-success">Valid input</p>
            <p v-else class="help is-danger">{{ inputErrorMessage }}</p>
          </div>
          <div class="field">
            <div class="label">Preview</div>
            <div ref="target"></div>
            <div :id="controllerDomID"></div>
          </div>
        </form>
        <p>The mint fee amounts to {{ (price * 1e-18).toString() }} xDai.</p>
      </section>

      <footer class="modal-card-foot">
        <button class="button is-primary" @click="mint" :class="{'is-loading': waiting}" :disabled="mintButtonDisabled">Mint</button>
        <button class="button" @click="close">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import abcjs from "abcjs";
import { audioParams } from "../config.js";


const visualOptions = {
  displayLoop: true,
  displayRestart: false,
  displayPlay: true,
  displayProgress: true,
  displayWarp: false,
};

import {
  validateABC,
  validateTunes,
  decorateBarABC,
  getValidationErrorMessage,
} from "../abc.js";

const renderOptions = {
  staffwidth: 320,
};

export default {
  name: "MintModal",
  props: ["account", "barID"],

  data() {
    return {
      abcInput: "",
      abcChecks: null,
      tuneChecks: null,
      waiting: false,
      synthController: null,
      price: null,
      mounted: false,
    }
  },

  computed: {
    controllerDomID() {
      return "abcjs-player-".concat(this._uid);
    },
    mintButtonDisabled() {
      return this.waiting || this.price == null || !this.abcInput || !this.abcChecks.valid || !this.tuneChecks.valid
    },
    inputErrorMessage() {
      if (!this.abcChecks) {
        return null
      }
      return getValidationErrorMessage(this.abcChecks, this.tuneChecks);
    },
  },

  watch: {
    abcInput: {
      immediate: true,
      handler() {
        this.renderAndValidatePreview();
      },
    },
  },

  created() {
    this.$contract.price().then((price) => {
      this.price = price
    }).catch((error) => {
      this.$error("failed to query price", error);
    })
  },

  mounted() {
    this.mounted = true;
    this.renderAndValidatePreview();
  },

  methods: {
    close() {
      this.$emit("closed");
    },
    renderAndValidatePreview() {
      const tunes = abcjs.renderAbc(
        this.$refs.target,
        decorateBarABC(this.abcInput),
        renderOptions
      );

      this.abcChecks = validateABC(this.abcInput);
      if (this.abcChecks.valid) {
        this.tuneChecks = validateTunes(tunes);
      } else {
        this.tuneChecks = null
      }
      
      if (this.mounted) {
        this.synthController = new abcjs.synth.SynthController();
        this.synthController.load("#".concat(this.controllerDomID), {}, visualOptions);
        this.synthController.setTune(tunes[0], false, audioParams);
      }
    },
    async mint() {
      if (this.mintButtonDisabled) {
        return
      }

      this.waiting = true;
      let tx;
      try {
        const signer = this.$provider.getSigner(this.account)
        const contract = this.$contract.connect(signer)
        tx = await contract.mintBar(
          this.account,
          this.barID,
          this.abcInput,
          {
            value: this.price,
          },
        )
      } catch (error) {
        this.$error('failed to send mint transaction', error)
        this.waiting = false
        return
      }

      try {
        await tx.wait()
      } catch (error) {
        this.$error('mint transaction failed', error)
        this.waiting = false;
        return
      }

      this.waiting = false;
      this.close();
    },
  }
};
</script>
