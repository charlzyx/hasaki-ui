<template>
  <div class="home">
    <div class="header main">
      <div class="header__title">Hasaki! </div>
    </div>
    <div class="content">
      <div class="content__title">前端反向代理工具</div>
      <p>「再不拔出来用，我就快和白杨树融为一体了。」</p>
    </div>
    <div>
      <router-link to="/settings">
        <div class="wwwwwidth-button hvr-sweep-to-right ">
          起 步 🚀
        </div>
      </router-link>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Hasaki"
};
</script>
<style lang="css">
.hvr-sweep-to-right:before {
  background-color: #2f79d0 !important;
}
.w-button {
  padding: 0 3%;
  margin: 16px 0;
  box-shadow: none;
  font-family: Segoe UI WestEuropean, Segoe UI, -apple-system,
    BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #333;
  font-weight: 400;
  border: 1px solid none;
  cursor: pointer;
  display: inline-block;
  height: 32px;
  min-width: 80px;
}
.wwwwwidth-button {
  padding: 4px 20px 6px;
  padding-left: 66.666%;
  box-shadow: none;
  font-family: Segoe UI WestEuropean, Segoe UI, -apple-system,
    BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #333;
  font-size: 16px;
  font-weight: 400;
  background-color: #f4f4f4;
  border: 1px solid none;
  cursor: pointer;
  display: inline-block;
  height: 32px;
  min-width: 80px;
}
</style>
