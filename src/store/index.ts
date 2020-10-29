import { Config, Project, Rule } from '@/db';

import Vue from "vue";
import Vuex from "vuex";
import _ from 'lodash';
import axios from 'axios';

Vue.use(Vuex);

const init = new Config();

export const ACTIONS = {
  PROJECT_DEL: 'PROJECT_DEL',
  PROJECT_UP: 'PROJECT_UP',
  RULE_DEL: 'RULE_DEL',
  RULE_UP: 'RULE_UP',
  USE: 'USE',
  SYNC: 'SYNC'
};

const sync = (state: any) => {
  setTimeout(() => {
    const full = state.config;
    const usingProject = state.config.projects.find((p: any) => p.id === full.using);
    axios.post('/push', {
      using: usingProject,
      full,
    });
  })
}


export default new Vuex.Store({
  state: {
    config: init,
  },
  getters: {
    now(state) {
      const { using, projects } = state.config;
      return projects.find(x => x.id === using);
    }
  },
  mutations: {
    PROJECT_DEL(state, pid: string) {
      const projects = state.config.projects;
      const idx = projects.findIndex(x => x.id === pid);
      if (idx > -1) {
        state.config.projects.splice(idx, 1);
      }
      sync(state);
    },
    PROJECT_UP(state, project: Project) {
      const projects = state.config.projects;
      const idx = projects.findIndex(x => x.id === project.id);
      if (idx > -1) {
        const oldProject = state.config.projects[idx];
        state.config.projects[idx] = { ...oldProject, ...project };
      } else {
        state.config.projects.push(project);
      }
      sync(state);
    },
    RULE_DEL(state, { pid, rid }) {
      const projects = state.config.projects;
      const idx = projects.findIndex(x => x.id === pid);
      if (idx > -1) {
        const project = state.config.projects[idx];
        const ridx = project.rules.findIndex(x => x.id === rid);
        if (ridx > -1) {
          project.rules.splice(ridx, 1);
        }
      }
      sync(state);
    },
    RULE_UP(state, { pid, rule }) {
      const projects = state.config.projects;
      const idx = projects.findIndex(x => x.id === pid);
      if (idx > -1) {
        const project = state.config.projects[idx];
        const ridx = project.rules.findIndex(x => x.id === rule.id);
        if (ridx > -1) {
          const oldRule = project.rules[ridx];
          project.rules[ridx] = { ...oldRule, ...rule };
        } else {
          project.rules.push(rule);
        }
      }
      sync(state);
    },
    USE(state, pid) {
      state.config.using = pid;
      sync(state);
    },
    SYNC(state, config) {
      const projects = _.uniqBy([...state.config.projects, ...config.projects], x => x.id);
      state.config = { ...state.config, ...config, projects };
      console.log('state.config');
      setTimeout(() => {
        sync(state);
      })
    }
  },
  actions: {
    [ACTIONS.PROJECT_DEL]({ commit }, pid: string) {
      commit("PROJECT_DEL", pid);
    },
    [ACTIONS.PROJECT_UP]({ commit }, project: Project) {
      commit("PROJECT_UP", project);
    },
    [ACTIONS.RULE_DEL]({ commit }, { pid, rid }) {
      commit("RULE_DEL", { pid, rid })
    },
    [ACTIONS.RULE_UP]({ commit }, { pid, rule }) {
      commit("RULE_UP", { pid, rule });
    },
    [ACTIONS.USE]({ commit, state }, pid) {
      const using = state.config.projects.find(p => p.id === pid);
      const full = { ...state.config };
      full.using = pid;
      axios.post('/push', {
        using,
        full,
      });
      commit("USE", pid);
    },
    [ACTIONS.SYNC]({ commit }, config) {
      commit("SYNC", config);
    }
  },
  modules: {}
});
