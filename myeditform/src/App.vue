<template>
  <div class="container">
    <EditTable :tableHead.sync="tableHead" :tableData.sync="tableData"></EditTable>
    <FsData :tableHead.sync="tableHead" :tableData.sync="tableData"></FsData>
    <button @click="emit">同步上传</button>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from "vue";
import EditTable from "./components/EditTable";
import FsData from "./components/FsData"
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
      socket:'',
    };
  },
  created(){
    let that=this;
    this.socket=io('127.0.0.1:3000');
    this.socket.on('getTH',msg=>{
      this.tableHead=msg.TH;
      this.tableData=msg.TD;
      console.log("收到TH")
    })
  },
  methods:{
    emit:function(){
      this.socket.emit('sentTH',{TH:this.tableHead,TD:this.tableData});
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
.container{
    display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* flex-direction: column; */
  align-items: center;
}
</style>

