<template>
  <!-- <div class="container">
    <EditTable :tableHead.sync="tableHead" :mode="mode" :tableData.sync="tableData"></EditTable>
    <FsData :tableHead.sync="tableHead" :tableData.sync="tableData"></FsData>
    <button @click="emit">同步上传</button>
    <div>
      <select v-model="mode">
        <option value="local">本地模式</option>
        <option value="net">联网模式</option>
      </select>
    </div>
  </div>-->
  <div>
    <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
      <el-tab-pane
        :key="item.name"
        v-for="item in editableTabs"
        :label="item.title"
        :name="item.name"
      >
        <EditTable></EditTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from "vue";
import EditTable from "./components/EditTable";
import FsData from "./components/FsData";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
export default {
  components: {
    EditTable,
    FsData
  },
  data() {
    return {
      tableHead: ["姓名", "性别"],
      tableData: [["lwk", "男"]],
      socket: "",
      mode: "local",
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "New Tab",
          name: "1",
        }
      ],
      tabIndex: 1
    };
  },
  created() {
    // let that = this;
    // this.socket = io("127.0.0.1:3000");
    // this.socket.on("getTH", msg => {
    //   this.tableHead = msg.TH;
    //   this.tableData = msg.TD;
    //   console.log("收到TH");
    // });
  },
  methods: {
    emit: function() {
      this.socket.emit("sentTH", { TH: this.tableHead, TD: this.tableData });
    },
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "New Tab",
          name: newTabName,
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }
  // watch: {
  //   tableHead: {
  //     handler(newval,oldval) {
  //       console.log(newval)
  //       console.log(oldval)
  //       //this.socket.emit('sentTH',newval);
  //     },
  //     deep: true
  //   },
  //   tableData: {
  //     handler(newval) {
  //       console.log(newval);
  //     },
  //     deep: true
  //   },
  // }
};
</script>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* flex-direction: column; */
  align-items: center;
}
</style>

