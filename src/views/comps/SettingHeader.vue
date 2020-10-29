<template>
  <div class="settings-header">
    <div class="content ms-bgColor-blue ms-fontColor-white">
      <navs></navs>
      <div class="content__title">
        <div>设置面板</div>
      </div>
      <p>当前项目 [{{ now.name || "-" }}]</p>
      <div class="white-hero">
        <ou-dialog
          type="lgHeader"
          title="远程地址"
          v-model="visible"
          subText="请输入远程配置文件地址"
        >
          <div slot="actions">
            <ou-text-field v-model="remote"></ou-text-field>
            <div style="display: flex; justify-content: space-between;">
              <ou-button @click="visible = false">点错了</ou-button>
              <ou-button type="primary" @click="sync">装载</ou-button>
            </div>
          </div>
        </ou-dialog>
        <ou-button type="primary" @click="visible = true">载入远程配置</ou-button >
        <input ref="filereader" @change="onUp" style="display: none;" type="file">
        <ou-button type="primary" @click="upFile">从文件导入</ou-button >
        <ou-button type="primary" @click="exp">导出当前配置</ou-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navs from './Nav';
import { saveAs } from "file-saver";

import { ACTIONS } from "../../store";
export default {
  components: { Navs },
  name: "settingsheaders",
  data() {
    return {
      visible: false,
      remote: ""
    };
  },
  computed: {
    now() {
      return this.$store.getters.now || {};
    },
    config() {
      return this.$store.state.config || {};
    }
  },
  methods: {
    upFile() {
      const up = this.$refs.filereader;
      up.click();
    },
    onUp(e) {
        const file = e.target.files[0]
        const fr = new FileReader()
        fr.onload = () => {
          const str = fr.result;
          try {
            const conf = JSON.parse(str);
            this.$store.dispatch(ACTIONS.SYNC, conf);
          } catch (error) {
            console.error('文件格式错误' + error);
          }
        }
        fr.readAsText(file)
    },
    sync() {
      axios.get("load", { params: { cloud: this.remote }}).then(resp => {
        this.visible = false;
        try {
          const config = JSON.parse(resp.data);
          this.$store.dispatch(ACTIONS.SYNC, config);
        } catch (error) {
          console.error("加载配置错误" + error);
        }
      });
    },
    exp() {
      const conf = JSON.stringify(this.$store.state.config, null, 2).split(
        /\n/
      );
      const blob = new Blob(conf, {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "config.full.json");
    }
  }
};
</script>
<style lang="css">
.white-hero {
  display: flex;
  justify-content: flex-end;
}
/* .white-hero .ms-Button-label {
  color: white !important;
} */
</style>
