<template>
  <div style="display: inline-block">
    <div ref="closer" style="display: none;"></div>
    <ou-callout
      ref="projectConfirm"
      type="OOBE"
      :title="title"
      :content="content"
    >
      <div slot="actions">
        <div class="space-between">
          <ou-button @click="onCancel">取消</ou-button>
          <ou-button @click="onConfirm" type="primary">确定</ou-button>
        </div>
      </div>
      <slot></slot>
    </ou-callout>
  </div>
</template>
<script>
export default {
  props: ["title", "content"],
  methods: {
    onCancel() {
      this.$emit("cancel");
      this.$refs.closer.click();
    },
    onConfirm() {
      this.$refs.closer.click();
      this.$emit("confirm");
    }
  }
};
</script>

<style lang="css">
.space-between {
  display: flex;
  justify-content: space-between;
}
</style>
