<template>
  <div v-if="wrongNetwork || !providerFound || !account">
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <div v-if="providerFound && !wrongNetwork && !account" class="notification">
              <p class="has-text-centered">
                Press the button below to connect to your wallet.
              </p>
              <div class="has-text-centered">
                <button
                  class="button is-primary mt-4"
                  :disabled="waiting"
                  :class="{ 'is-loading': waiting }"
                  @click="connect"
                >
                  Connect
                </button>
              </div>
            </div>

            <div v-if="!wrongNetwork && !providerFound" class="notification">
              <p class="has-text-centered">
                No provider found. Please install a browser wallet such as Metamask and refresh the page.
              </p>
            </div>

            <div v-if="wrongNetwork" class="notification">
              <p class="has-text-centered">
                Your wallet is connected to the wrong network. Please select xDai and refresh the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Connect",
  props: ["account", "wrongNetwork"],
  data() {
    return {
      waiting: false,
      providerFound: this.$provider !== null,
    };
  },

  methods: {
    async connect() {
      this.waiting = true;
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        this.$error("failed to connect to wallet", error);
      }
      this.waiting = false;
    },
  },
};
</script>

<style scoped>
div .notification {
  width: 512px;
}
</style>
