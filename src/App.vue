<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import axios from "axios";
import { ACTIONS } from "@/store";
export default {
  created() {
    axios.get("/pull").then(resp => {
      const config = resp.data.full;
      const uid = resp.data.using && resp.data.using.id;
      config.using = uid;
      this.$store.dispatch(ACTIONS.SYNC, config);
      console.log(resp);
    });
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.header {
  padding: 0 40px 15px;
}

.header__title {
  padding: 90px 0 40px 0;
  font-size: 72px;
  word-wrap: break-word;
}
.header__nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: 10px;
}
.header__nav li {
  display: flex;
}
.header__nav--item {
  display: inline-block;
  text-decoration: none;
  margin-right: 28px;
  cursor: pointer;
  text-align: center;
}
.header__nav--item:hover {
  font-weight: 600;
}
.header__nav--item:after {
  color: transparent;
  content: attr(data-title);
  display: block;
  height: 1px;
  font-weight: 900;
}
.content {
  padding: 50px;
}
.content:nth-child(even) {
  background: #fff;
}
.content__title {
  margin: 10px 0 24px;
  font-size: 36px;
}

.overview_content {
  max-width: 45em;
}
.overview_content h1 {
  font-size: 36px;
  font-weight: 100;
}
.overview_content h2 {
  font-size: 21px;
  font-weight: 100;
  margin-bottom: 4px;
  margin-top: 48px;
}
.overview_content p {
  padding: 16px 0;
  margin: 0;
  line-height: 1.5;
}
.overview_content ul {
  padding-left: 18px;
}
.overview_content li {
  margin-bottom: 16px;
}
.overview_content pre {
  line-height: 1.5;
  margin: 0;
  margin-top: 25px;
  padding: 15px 20px;
  border: none;
  background: #212121;
  box-shadow: none;
  max-height: 450px;
  overflow: auto;
  color: #fff;
}
.overview_content a {
  color: #0078d7;
  text-decoration: none;
}
</style>
