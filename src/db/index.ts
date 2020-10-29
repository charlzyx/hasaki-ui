
const ids = {
  pid: +new Date(),
  rid: +new Date(),
};

type Capture = {
  match: string;
}

type Dispatch = {
  to: string;
}

class Rule {
  constructor({ name = "", desc = "", use = false, weight = 0, capture = { match: '' }, dispatch = { to: '' } } = {}) {
    this.id = `r_${++ids.rid}`;
    this.name = name;
    this.desc = desc;
    this.use = use;
    this.weight = weight;
    this.capture = capture;
    this.dispatch = dispatch;
  }
  id = "";
  name = "";
  desc = "";
  use = true;
  weight = 0;
  capture: Capture = {
    match: ''
  }
  dispatch: Dispatch = {
    to: ''
  }

}

class Project {
  constructor({ name = "", desc = "", rules = [] } = {}) {
    this.id = `p_${++ids.pid}`;
    this.name = name;
    this.desc = desc;
    this.rules = rules;
  }

  id = "";
  name = "";
  desc = "";
  rules: Rule[] = [];
}

class Config {
  constructor({ using = '', version = 1.0, desc = "", projects = [] } = {}) {
    this.using = using;
    this.version = version;
    this.desc = desc;
    this.projects = projects;
  }
  using = '';
  version = 1.0;
  desc = "";
  projects: Project[] = [];
}

export { Project, Rule, Config };
