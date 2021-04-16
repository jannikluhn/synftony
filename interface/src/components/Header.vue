<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <p class="title has-text-centered">Synftony No. 1</p>
        <p>
          Synftony No. 1 is a collaborative and open music project. Each bar is
          represented by an NFT whose owner has the right to fill it with notes.
          Anyone can add a new bar to the end of the piece for a small fee.
        </p>
      </div>
    </div>

    <div class="hero-foot">
      <nav class="tabs is-centered is-large is-boxed">
        <ul>
          <li :class="{ 'is-active': tab == 'listen', 'has-text-black': tab == 'listen' }">
            <a @click="changeTab('listen')">Piece</a>
          </li>
          <li :class="{ 'is-active': tab == 'inspect', 'has-text-black': tab == 'inspect' }">
            <a @click="changeTab('inspect')">In Pieces</a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script>
export default {
  name: "Header",

  data() {
    return {
      tab: "listen",
    };
  },

  methods: {
    changeTab(tab) {
      this.tab = tab;
      this.$emit("tabChanged", tab);
    },
  },
};
</script>
