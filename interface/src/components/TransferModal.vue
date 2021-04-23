<template>
  <div class="modal" :class="{ 'is-active': true }">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Transfer Bar {{ barID }}</p>
      </header>

      <section class="modal-card-body">
        <form>
          <div class="field">
            <label class="label">Receiver Address</label>
            <input
              class="input"
              type="text"
              placeholder="0x..."
              v-model="addressInput"
            />
            <p v-if="addressInputValid" class="help is-success">
              Valid address
            </p>
            <p v-else class="help is-danger">Invalid address</p>
          </div>
          <div v-if="error" class="message is-danger">
            <div class="message-body">
              <p>{{ error }}</p>
            </div>
          </div>
        </form>
      </section>

      <footer class="modal-card-foot">
        <button
          class="button is-primary"
          @click="transfer"
          :class="{ 'is-loading': waiting }"
          :disabled="waiting || !addressInputValid"
        >
          Transfer
        </button>
        <button class="button" @click="close">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
export default {
  name: "TransferModal",
  props: ["account", "barID"],

  data() {
    return {
      addressInput: "",
      waiting: false,
      error: null,
    };
  },

  computed: {
    addressInputValid() {
      try {
        return this.addressInput == ethers.utils.getAddress(this.addressInput);
      } catch {
        return false;
      }
    },
  },

  methods: {
    close() {
      this.$emit("closed");
    },
    async transfer() {
      if (this.waiting || !this.addressInputValid) {
        return;
      }

      this.waiting = true;
      this.error = null;
      let tx;
      try {
        const signer = this.$provider.getSigner(this.account);
        const contract = this.$contract.connect(signer);
        tx = await contract["safeTransferFrom(address,address,uint256)"](
          this.account,
          this.addressInput,
          this.barID
        );
      } catch (error) {
        this.error = "Failed to send transfer transaction: " + error.message;
        this.waiting = false;
        return;
      }

      try {
        await tx.wait();
      } catch (error) {
        this.error = "Transfer transaction failed: " + error.message;
        this.waiting = false;
        return;
      }

      this.waiting = false;
      this.close();
    },
  },
};
</script>
