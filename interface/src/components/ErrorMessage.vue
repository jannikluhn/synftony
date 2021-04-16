<template>
  <div class="notification is-danger">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "ErrorMessage",
  props: ["message"],
}
</script>