<template>
  <div class="settings">
    <setting-header></setting-header>
    <div class="full">
      <div class="wrapper">
        <div class="f25 panel">
          <div class="panel__title">
            <div>
              项目列表
            </div>
            <ou-button @click="editProject()" type="primary">创建</ou-button>
          </div>
          <div class="empty" v-show="config.projects.length === 0">
            暂无项目 , 请创建
          </div>
          <ou-list>
            <ou-list-item
              v-for="project in config.projects"
              :key="project.id"
              :primaryText="project.name || '-'"
              :secondaryText="project.desc || '-'"
              :isUnread="use === project.id"
              @click="useProject(project.id)"
            >
              <ou-list-actions>
                <pop-confirm
                  @confirm="delProject(project)"
                  title="确定要删除吗?"
                  content="版本控制还未实现, 删除之后不可恢复!!!"
                >
                  <ou-list-action-item icon="Delete"></ou-list-action-item>
                </pop-confirm>
                <ou-list-action-item
                  @click="editProject(project)"
                  icon="Edit"
                ></ou-list-action-item>
                <pop-confirm
                  v-if="!editing.project && !editing.rule"
                  @confirm="using(project.id)"
                  title="要使用当前配置吗?"
                  content="🚀"
                >
                  <span
                    :class="
                      config.using === project.id ? 'using-hightlight' : ''
                    "
                  >
                    <ou-list-action-item icon="Pinned"></ou-list-action-item>
                  </span>
                </pop-confirm>
              </ou-list-actions>
            </ou-list-item>
          </ou-list>
        </div>
        <div class="f25 panel" v-show="editing.project">
          <div class="panel__title sub">
            {{ creating.project ? "创建项目" : "编辑项目" }}
          </div>
          <div class="box">
            <ou-text-field v-model="project.name" label="项目名称" />
            <ou-text-field
              type="multiline"
              v-model="project.desc"
              label="项目描述"
            />
            <ou-button @click="cancelProject">取 消</ou-button>
            <div class="space"></div>
            <ou-button @click="saveProject" type="primary">保 存</ou-button>
          </div>
        </div>
        <div class="f25 panel">
          <div class="panel__title">
            <div>
              规则集合
            </div>
            <ou-button @click="editRule()" type="primary">创建</ou-button>
          </div>
          <div class="empty" v-show="rules.length === 0">
            暂无规则, 请创建
          </div>
          <ou-list>
            <ou-list-item
              v-for="item in rules"
              :key="item.name"
              :primaryText="item.name || '-'"
              :secondaryText="item.desc || '-'"
              :isUnseen="item.id === rule.id"
              @click="editRule(item)"
            >
              <ou-list-actions>
                <pop-confirm
                  @confirm="delRule(item)"
                  title="确定要删除吗?"
                  content="版本控制还未实现, 删除之后不可恢复!!!"
                >
                  <ou-list-action-item icon="Delete"></ou-list-action-item>
                </pop-confirm>
                <ou-toggle v-model="item.use" />
              </ou-list-actions>
            </ou-list-item>
          </ou-list>
        </div>
        <div :class="editing.project ? 'f25' : 'f50'" class="panel">
          <div class="panel__title">
            {{ creating.rule ? "创建规则" : "编辑规则" }}
          </div>
          <div>
            <div v-show="editing.rule" class="box">
              <ou-toggle v-model="rule.use" description="是否启用此规则" />
              <ou-text-field v-model="rule.name" label="规则名称" />
              <ou-text-field v-model="rule.weight" label="规则权重" />
              <ou-label>默认权重根据 path 捕获正则长度</ou-label>
              <ou-text-field
                type="multiline"
                v-model="rule.desc"
                label="规则描述"
              />
              <ou-label>URL 匹配规则</ou-label>
              <div class="group">
                <ou-text-field
                  @input="v => (rule.weight = `${v.length}`)"
                  v-model="rule.capture.match"
                  label="path 捕获正则"
                />
              </div>
              <ou-label>派发动作</ou-label>
              <div class="group">
                <ou-text-field v-model="rule.dispatch.to" label="转发 uri" />
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <ou-button @click="cancelRule">取 消</ou-button>
                <div class="space"></div>
                <ou-button @click="saveRule" type="primary">保 存</ou-button>
              </div>
              <ou-label>测试</ou-label>
              <div class="group">
                <ou-text-field
                  @input="runTesting"
                  v-model="testing.uri"
                  label="测试 uri"
                />
                <ou-toggle v-model="testing.is" disabled label="是否匹配" />
                <ou-text-field disabled v-model="testing.ans" label="当前匹配" />
                <ou-text-field disabled v-model="testing.rank.to" label="Rank: 最终匹配路径" />
                <ou-text-field disabled v-model="testing.rank.name" :label="'最终胜出规则:' + (testing.rank.id === rule.id ? '当前规则': rule.name)" />
              </div>
            </div>
          </div>
          <div class="empty" v-show="!editing.rule">
            暂无编辑编辑的规则
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Project, Rule } from "@/db";
import { ACTIONS } from "@/store";
import axios from "axios";
import PopConfirm from "./comps/PopConfirm";
import SettingHeader from "./comps/SettingHeader";

export default {
  name: "settings",
  components: { PopConfirm, SettingHeader },
  computed: {
    config() {
      const config = this.$store.state.config || {};
      return config;
    },
    rules() {
      const project = this.config.projects.find(x => x.id === this.use);
      return project ? project.rules : [];
    }
  },
  data() {
    return {
      use: "",
      testing: {
        uri: "",
        is: "-",
        ans: "",
        rank: {
          to: "",
          id: "",
          name: ""
        },
      },
      creating: {
        project: false,
        rule: false
      },
      editing: {
        project: false,
        rule: false
      },
      project: new Project(),
      rule: new Rule()
    };
  },
  watch: {
    use() {
      this.editing.rule = false;
    },
    "editing.project"() {
      this.editing.rule = false;
    }
  },
  mounted() {
    this.use = this.config.using;
  },
  methods: {
    runTesting(v) {
      const data = {
        rules: this.project.rules,
        uri: v,
        match: this.rule.capture.match,
        to: this.rule.dispatch.to
      };
      axios.post("testing", data).then((resp) => {
        this.testing.is = resp.data.is;
        if (this.testing.is) {
          this.testing.ans = resp.data.next;
        } else {
          this.testing.ans = '-'
        }
        this.rank = resp.rank;
      });
    },
    useProject(pid) {
      this.use = pid;
    },
    editProject(p) {
      this.creating.project = !p;
      const project = p ? { ...p } : new Project();
      this.editing.project = true;
      this.use = project.id;
      this.project = project;
    },
    delProject(p) {
      this.use = this.config.projects[0] ? this.config.projects[0].id : "";
      this.$store.dispatch(ACTIONS.PROJECT_DEL, p.id);
      this.project = new Project();
    },
    cancelProject() {
      this.editing.project = false;
    },
    saveProject() {
      this.editing.project = false;
      this.$store.dispatch(ACTIONS.PROJECT_UP, this.project);
    },
    editRule(r) {
      this.creating.rule = !r;
      const rule = r ? { ...r } : new Rule();
      this.editing.rule = true;
      this.rule.id = rule.id;
      this.testing = {
        is: false,
        uri: '',
        to: '',
        rank: {
          to: '',
          name: '',
          id: ''
        }
      }
      this.rule = rule;
    },
    delRule(r) {
      this.editing.rule = false;
      this.$store.dispatch(ACTIONS.RULE_DEL, {
        pid: this.use,
        rid: r.id
      });
    },
    cancelRule() {
      this.editing.rule = false;
    },
    saveRule() {
      this.editing.rule = false;
      this.$store.dispatch(ACTIONS.RULE_UP, { rule: this.rule, pid: this.use });
    },
    using(pid) {
      this.$store.dispatch(ACTIONS.USE, pid);
    }
  }
};
</script>

<style lang="css">
.settings {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.full {
  flex: 1;
  display: flex;
}
.box {
  padding: 24px;
}
.wrapper {
  flex: 1;
  display: flex;
  margin: 0 auto;
}
.wrapper__content {
  padding: 0;
}
.wrapper__content:last-child {
  border-right: 1px solid transparent;
}
.panel {
  height: 100%;
  border-right: 1px solid #f6f6f6;
}
.space {
  display: inline-block;
  width: 20px;
}
.group {
  border-top: 1px solid #a6a6a6 ;
  padding-left: 16px;
}
.empty {
  display: flex;
  padding: 50px 20px;
  justify-content: center;
  align-items: center;
}
.panel__title {
  padding: 12px 24px;
  font-size: 32px;
  color: #070775;
  border-bottom: 1px solid #f6f6f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel__title.sub {
  font-size: 24px;
  padding: 18px 24px;
  color: #c7c7c7;
}
.f25 {
  flex: 25;
}
.f50 {
  flex: 50;
}
.ms-ListItem {
  border-bottom: 1px solid #f6f6f6;
}
.ms-ListItem:hover {
  background-color: #edf5fc;
}
.ms-ListItem-action {
  padding-left: 12px;
  padding-right: 12px;
  font-size: 16px;
}

.using-hightlight .ms-ListItem-action {
  font-size: 24px;
  color: #006dd1;
}
</style>
