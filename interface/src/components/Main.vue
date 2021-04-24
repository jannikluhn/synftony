<template>
  <div>
    <div v-if="loadingBars">
      <LoadingTab />
    </div>
    <div v-else>
      <ErrorOverlay />
      <ListenTab v-show="tab == 'listen'" :abc="sanitizedABC" />
      <InspectTab
        v-show="tab == 'inspect'"
        :wrongNetwork="wrongNetwork"
        :account="account"
        :bars="bars"
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
      barsValid: {},
    };
  },

  computed: {
    sanitizedABC() {
      let sanitizedABC = "%%printtempo false\nM: 4/4\nQ:1/4=140\n";
      for (let i = 0; i < this.bars.length; i++) {
        const bar = this.bars[i];
        if (this.barsValid[bar.id]) {
          sanitizedABC += bar.abc;
        } else {
          sanitizedABC += placeholderBarABC;
        }
        sanitizedABC += " | ";
        if ((i + 1) % 4 == 0) {
          sanitizedABC += "\n";
        }
      }
      return sanitizedABC;
    },
  },

  methods: {
    onBarValidated(key, valid) {
      this.$set(this.barsValid, key, valid);
    },
  },
};
</script>
