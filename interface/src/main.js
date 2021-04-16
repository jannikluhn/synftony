import Vue from "vue";
import "@/assets/main.scss";
import "abcjs/abcjs-audio.css";
import App from "./App.vue";
import { ethers } from "ethers";
import SynftonyMetadata from "./assets/Synftony.json";
import { address } from "./assets/addresses.js";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

Vue.config.productionTip = false;

if (window.ethereum) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(address, SynftonyMetadata.abi, provider);

  Vue.prototype.$provider = provider;
  Vue.prototype.$contract = contract;
} else {
  Vue.prototype.$provider = null;
  Vue.prototype.$contract = null;
}

const apolloClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/jannikluhn/synftony",
  cache: new InMemoryCache(),
});
Vue.prototype.$apolloClient = apolloClient;

Vue.prototype.$error = console.log;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
