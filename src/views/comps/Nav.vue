<template>
  <nav class="nav-bar">
    <router-link to="/settings" >
      <ou-button style="" type="primary">设置面板 → </ou-button>
    </router-link>
    <a href="/__logs/info.log" target="__blank">
      <ou-button style="" type="primary">查看监控 → </ou-button>
    </a>
  </nav>
</template>
<script lang="ts">
export default {}
</script>
<style scoped>
.nav-bar {
  position: absolute;
  top: 0;
  right: 0;
}

</style>
