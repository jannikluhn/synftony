<template>
  <div id="app">
    <Header @tabChanged="onTabChanged" />
    <Main :wrongNetwork="wrongNetwork" :account="account" :tab="tab" :bars="bars" :loadingBars="loadingBars" />
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
      bars: null,
      account: null,
      wrongNetwork: false,
      loadingBars: true
    };
  },

  created() {
    this.checkNetwork()
    this.loadAccount()

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
      })
      .catch((error) => {
        this.$error("failed to query graph", error);
      })
      .finally(() => {
        this.loadingBars = false;
      })
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

    checkNetwork() {
      if (!this.$provider) {
        this.wrongNetwork = false
        return
      }
      this.$provider.getNetwork().then((network) => {
        this.wrongNetwork = network.chainId != 100 // xdai
      }).catch((error) => {
        this.$error("failed to query network", error)
      })
    },
    loadAccount() {
      if (!this.$provider) {
        return
      }
      this.$provider
        .listAccounts()
        .then((accounts) => {
          this.onAccountsChanged(accounts);
        })
        .catch((error) => {
          this.$error("failed to get accounts", error);
        })
        .finally(() => {
          window.ethereum.on("accountsChanged", this.onAccountsChanged);
        });
    }
  },
};
</script>
