<template>
  <nav class="nav-bar">
    <router-link to="/settings" >
      <ou-button style="" type="primary">设置面板 → </ou-button>
    </router-link>
    <router-link to="/__logs/info.log" >
      <ou-button style="" type="primary">查看监控 → </ou-button>
    </router-link>
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
