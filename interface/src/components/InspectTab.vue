<template>
  <div>
    <Connect :wrongNetwork="wrongNetwork" :account="account" />

    <section class="section">
      <div class="container">
        <table class="table is-fullwidth">
          <thead>
            <th>Index</th>
            <th>Bar</th>
            <th>Owner</th>
            <th>Owner Actions</th>
          </thead>
          <tbody>
            <tr v-for="bar in bars" :key="bar.id">
              <th>
                <p>{{ bar.id }}</p>
              </th>
              <td>
                <Bar :bar="bar" @validated="onBarValidated" />
              </td>
              <td>
                <p>{{ bar.owner }}</p>
              </td>
              <td>
                <div class="field is-grouped is-grouped-centered">
                  <div class="control">
                    <button
                      class="button"
                      :disabled="wrongNetwork || account != bar.owner"
                      @click="showEditModal(bar)"
                    >
                      Edit
                    </button>
                  </div>
                  <div class="control">
                    <button
                      class="button"
                      :disabled="wrongNetwork || account != bar.owner"
                      @click="showTransferModal(bar)"
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="columns is-centered">
          <div class="column is-narrow">
            <button
              class="button is-primary mint-button"
              :disabled="wrongNetwork || !account"
              @click="showMintModal"
            >
              Mint next bar
            </button>
          </div>
        </div>
      </div>
    </section>

    <TransferModal
      v-if="transferModalShown"
      :account="account"
      :barID="transferredBar.id"
      @closed="transferModalShown = false"
    />
    <EditModal
      v-if="editModalShown"
      :account="account"
      :barID="editedBar.id"
      :previousABC="editedBar.abc"
      @closed="editModalShown = false"
    />
    <MintModal
      v-if="mintModalShown"
      :account="account"
      :barID="bars.length"
      @closed="mintModalShown = false"
    />
  </div>
</template>

<script>
import Bar from "./Bar.vue";
import Connect from "./Connect.vue";
import TransferModal from "./TransferModal.vue";
import EditModal from "./EditModal.vue";
import MintModal from "./MintModal.vue";

export default {
  name: "InspectTab",
  props: ["bars", "account", "wrongNetwork"],
  components: {
    Bar,
    Connect,
    TransferModal,
    EditModal,
    MintModal,
  },
  data() {
    return {
      transferModalShown: false,
      transferredBar: null,
      
      editModalShown: false,
      editedBar: null,

      mintModalShown: false,
    };
  },
  methods: {
    onBarValidated(id, valid) {
      this.$emit("validated", id, valid);
    },
    showEditModal(bar) {
      this.hideAllModals();
      this.editedBar = bar;
      this.editModalShown = true;
    },
    showTransferModal(bar) {
      this.hideAllModals();
      this.transferredBar = bar;
      this.transferModalShown = true;
    },
    showMintModal() {
      this.hideAllModals();
      this.mintModalShown = true;
    },
    hideAllModals() {
      this.transferModalShown = false;
      this.transferredBar = null;
  
      this.editModalShown = false;
      this.editedBar = null;

      this.mintModalShown = false;
    }
  },
};
</script>

<style scoped>
.table td {
  vertical-align: middle;
  text-align: center;
}

.table th {
  vertical-align: middle;
  text-align: center;
}

.table thead th {
  text-align: center;
}
</style>
