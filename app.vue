<template>
  <div class="container">
    <EditTable :tableHead.sync="tableHead" :tableData.sync="tableData"></EditTable>
    <FsData :tableHead.sync="tableHead" :tableData.sync="tableData"></FsData>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from "vue";
import EditTable from "./EditTable";
import FsData from "./FsData"
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
      tableData: [["lwk", "男"]]
    };
  },
  watch: {
    tableHead: {
      handler(newval) {
        console.log(newval);
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.container{
    display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>

