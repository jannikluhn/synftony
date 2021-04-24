<template>
  <div id="app">
    <Header @tabChanged="onTabChanged" />
    <Main
      :wrongNetwork="wrongNetwork"
      :account="account"
      :tab="tab"
      :bars="bars"
      :loadingBars="loadingBars"
    />
  </div>
</template>

<script>
import gql from "graphql-tag";
import { ethers } from "ethers";
import Header from "./components/Header.vue";
import Main from "./components/Main.vue";

const query = gql`
  {
    bars {
      id
      owner
      abc
    }
  }
`;

export default {
  name: "App",
  components: {
    Header,
    Main,
  },

  data() {
    return {
      tab: "listen",
      bars: [],
      account: null,
      wrongNetwork: false,
      loadingBars: true,
    };
  },

  created() {
    this.checkNetwork();
    this.loadAccount();

    this.$apolloClient
      .query({ query: query })
      .then((result) => {
        const bars = [];
        for (const bar of result.data.bars) {
          bars.push({
            id: ethers.BigNumber.from(bar.id).toNumber(),
            owner: ethers.utils.getAddress(bar.owner),
            abc: bar.abc,
          });
        }
        bars.sort((a, b) => a.id - b.id);
        this.bars = bars;

        if (this.$contract) {
          this.$contract.on("Transfer", this.onTransfer);
          this.$contract.on("BarChanged", this.onBarChanged);
        }
      })
      .catch((error) => {
        this.$error("Failed to query graph", error);
      })
      .finally(() => {
        this.loadingBars = false;
      });
  },

  methods: {
    onTabChanged(tab) {
      this.tab = tab;
    },
    onAccountsChanged(accounts) {
      if (accounts.length == 0) {
        this.account = null;
      } else {
        this.account = ethers.utils.getAddress(accounts[0]);
      }
    },

    onTransfer(from, to, barIndex) {
      barIndex = ethers.BigNumber.from(barIndex).toNumber();
      to = ethers.utils.getAddress(to);

      console.assert(barIndex <= this.bars.length);
      if (barIndex == this.bars.length) {
        // newly minted
        const bar = {
          id: barIndex,
          owner: to,
          abc: "",  // will be filled in BarChanged event
        }
        this.bars.push(bar);
      } else {
        // transferred
        this.bars.splice(barIndex, 1, {
          id: barIndex,
          owner: to,
          abc: this.bars[barIndex].abc,
        });
      }
    },
    onBarChanged(barIndex, abc) {
      barIndex = ethers.BigNumber.from(barIndex).toNumber();

      console.assert(barIndex < this.bars.length);
      this.bars.splice(barIndex, 1, {
        id: barIndex,
        owner: this.bars[barIndex].owner,
        abc: abc,
      });
    },

    checkNetwork() {
      if (!this.$provider) {
        this.wrongNetwork = false;
        return;
      }
      this.$provider
        .getNetwork()
        .then((network) => {
          this.wrongNetwork = network.chainId != 100; // xdai
        })
        .catch((error) => {
          this.$error("Failed to query network", error);
        });
    },
    loadAccount() {
      if (!this.$provider) {
        return;
      }
      this.$provider
        .listAccounts()
        .then((accounts) => {
          this.onAccountsChanged(accounts);
        })
        .catch((error) => {
          this.$error("Failed to get accounts", error);
        })
        .finally(() => {
          window.ethereum.on("accountsChanged", this.onAccountsChanged);
        });
    },
  },
};
</script>
