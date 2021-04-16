<template>
  <div>
    <ErrorOverlay />
    <div v-if="loadingBars">
      <LoadingTab />
    </div>
    <div v-else>
      <ListenTab v-show="tab == 'listen'" :abc="sanitizedABC" />
      <InspectTab
        v-show="tab == 'inspect'"
        :wrongNetwork="wrongNetwork"
        :account="account"
        :bars="individualBars"
        @validated="onBarValidated"
      />
    </div>
  </div>
</template>

<script>
import ListenTab from "./ListenTab.vue";
import InspectTab from "./InspectTab.vue";
import ErrorOverlay from "./ErrorOverlay.vue";
import LoadingTab from "./LoadingTab.vue";
import { placeholderBarABC } from "../abc.js";

export default {
  name: "Main",
  props: ["tab", "bars", "account", "wrongNetwork", "loadingBars"],

  components: {
    ListenTab,
    InspectTab,
    ErrorOverlay,
    LoadingTab,
  },

  data() {
    return {
      individualBars: [],
      individualBarsValid: [],
      sanitizedABC: "",
    };
  },

  watch: {
    bars: {
      immediate: true,
      handler() {
        this.renderBars();
      },
    },

    sanitizedABC() {},
  },

  methods: {
    renderBars() {
      this.individualBars.splice(0);
      this.individualBarsValid = {};
      for (const bar of this.bars || []) {
        this.individualBars.push(bar);
      }
    },

    onBarValidated(key, valid) {
      this.individualBarsValid[key] = valid;
      if (
        Object.keys(this.individualBarsValid).length >=
        this.individualBars.length
      ) {
        let sanitizedABC = "%%printtempo false\nM: 4/4\nQ:1/4=140\n";
        for (let i = 0; i < this.individualBars.length; i++) {
          const bar = this.individualBars[i];
          if (this.individualBarsValid[bar.id]) {
            sanitizedABC += bar.abc;
          } else {
            sanitizedABC += placeholderBarABC;
          }
          sanitizedABC += " | ";
          if ((i + 1) % 4 == 0) {
            sanitizedABC += "\n";
          }
        }
        this.sanitizedABC = sanitizedABC;
      }
    },
  },
};
</script>
