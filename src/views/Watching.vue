<template>
  <div class="home">
    <div class="content ms-bgColor-blue ms-fontColor-white">
      <navs></navs>
      <div class="content__title">监控 🚦</div>
      <p>最多存储 10000 条</p>
    </div>
    <div>
      <div class="empty" v-if="list.length === 0">什么都没有🛸</div>
      <ul>
        <li :key="log.uid" v-for="(log, i) in list">
          <details class="details">
            <summary class="details__summary"><span style="font-size: 1.2em">{{list.length - i}} </span>[{{dayjs(log.now * 1000).format('HH:mm:ss.sss')}}] 🚀 {{log.diff.uri.from}} ~> {{log.diff.uri.to}}</summary>
            <pre class="details__content">{{ JSON.stringify(log, null, 2) }}</pre>
          </details>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import Navs from './comps/Nav';
export default {
  components: { Navs },
  mounted() {
    const host = window.location.hostname;
    const socket = new WebSocket("ws://" + host + "/__hasaki__/ws");
    window.addEventListener('beforeunload', () => {
      socket.send("close");
      socket.onclose = function () {
        // not
      };
      socket.close();
    });
    // Connection opened
    socket.addEventListener("open", function(event) {
      socket.send("Hello Server!");
    });

    // Listen for messages
    socket.addEventListener("message", ev => {
      this.onMessage(ev.data);
    });
  },
  data() {
    return {
      dayjs,
      list: []
    };
  },
  methods: {
    onMessage(message) {
        let json = message;
        try {
          json = JSON.parse(message);
        } catch (error) {
          // nothing
        }
        if (json.trace) {
          // arr.sort((a, b) => b.now - a.now);
          this.list.unshift(json.data);
        }
    }
  }
};
</script>

<style lang="css">

.hvr-sweep-to-right:before {
  background-color: #2f79d0 !important;
}
.wwwwwidth-button {
  padding: 4px 20px 6px;
  padding-left: 46.666%;
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
ul li {
  border-bottom: 1px solid #F2F2F2;
}

.empty {
  padding: 4%;
  text-align: center;
  font-size: 32px;
  color: #d2d2d2;
}

.details {
  overflow: hidden;
  border-bottom: 1px solid #CFD8DC;
  transition: height 300ms ease-in-out;
}
.details:last-child {
  border-bottom: 0;
}
.details__summary, .details__content {
  padding: 4px;
}
.details__summary {
  position: relative;
  list-style: none;
  padding-left: 48px;
  outline: 0;
  cursor: pointer;
  transition: color 300ms ease-in-out;
}
[open] > .details__summary {
  color: #006DD1;
}
.details__summary::-webkit-details-marker {
  display: none;
}
.details__summary:before, .details__summary:after {
  content: "";
  position: absolute;
}
.details__summary:before {
  left: 20px;
  top: 50%;
  height: 2px;
  margin-top: -1px;
  width: 16px;
  background: #006DD1;
}
.details__summary:after {
  left: 28px;
  top: 50%;
  height: 16px;
  margin-top: -8px;
  width: 2px;
  margin-left: -1px;
  background: #006DD1;
  transition: all 300ms ease-in-out;
}
[open] .details__summary:after {
  opacity: 0;
  transform: translateY(25%);
}
.details__content {
  padding-top: 0;
  padding-left: 48px;
}


</style>
