<template>
  <div id="app">
    <div id="stars">
    </div>
    <div id="stars2">
    </div>
    <div id="stars3"></div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
