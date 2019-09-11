<template>
  <div id="app">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <router-view />
    <div class="copyright">
      <p>Designed & Powerd by 季晓东</p>
      <p>Copyright © 2019 - 9999 季晓东-作业提交系统-作业统计系统 版权所有</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.copyright {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #ccc;
}
</style>
