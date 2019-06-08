<template>
  <div>
    <div value="first" class="login-box" v-if="!ifLogin">
      <el-tabs>
        <el-tab-pane class="container" label="新建表格" name="first">
          <div style="margin-top:10vh">
            <span>表格名字:</span>
            <el-input v-model="newTabName"></el-input>
          </div>
          <el-button style="margin-top:5vh" @click="createTabName">新建</el-button>
        </el-tab-pane>
        <el-tab-pane class="container" label="连接至已有表格" name="second">
          <div style="margin-top:10vh">
            <span>表格名字:</span>
            <el-input v-model="linkTabName"></el-input>
          </div>
          <el-button style="margin-top:5vh" @click="linkTab">连接</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else>
      <el-table :data="tableData">
        <el-table-column
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          v-for="item in tableHead"
        >
          <template slot-scope="scope">
            <p>{{scope.row[item.prop]}}</p>
            <input
              v-if="showEdit[scope.$index]!=undefined&&showEdit[scope.$index]"
              v-model="scope.row[item.prop]"
              type="text"
            >
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-button @click="addHead()"></el-button>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button>
            <el-button
              v-if="showEdit[scope.$index]!=undefined&&showEdit[scope.$index]"
              size="mini"
              @click="completeEdit(scope.$index, scope.row)"
            >完成</el-button>
            <el-button
              v-if="showEdit[scope.$index]!=undefined&&showEdit[scope.$index]"
              size="mini"
              @click="cancelEdit(scope.$index, scope.row)"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="addRow" style="float:right" type="primary" icon="el-icon-plus" circle></el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "EditTable",
  data() {
    return {
      file: "",
      tableHead: [],
      tableData: [],
      maxTableHead: 5,
      mode: "local",
      propCount: 0,
      showEdit: [],
      ifLogin: false,
      newTabName: '',
      linkTabName:'',
    };
  },
  computed: {},
  watch: {
    tableHead: {
      handler(newval) {},
      deep: true
    }
  },
  created: function() {},
  methods: {
    handleEdit(index, row) {
      this.$set(this.showEdit, index, true);
      console.log(this.showEdit);
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    addHead() {
      this.propCount++;
      this.tableHead.push({ prop: this.propCount.toString(), label: "新建列" });
    },
    addRow() {
      this.tableData.push({});
    },
    completeEdit() {},
    cancelEdit(index) {
      this.$set(this.showEdit, index, false);
    },
    createTabName() {
      var that = this;
      this.$axios
        .get("/setTabName", {
          params: { newTabName: that.newTabName }
        })
        .then(res => {
          console.log(res);
          that.$message({
            showClose: true,
            message: res.info,
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    linkTab(){
      var that = this;
      this.$axios
        .get("/linkTab", {
          params: { linkTabName: that.linkTabName }
        })
        .then(res => {
          console.log(res);
          that.$message({
            showClose: true,
            message: res.info,
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.login-box {
  width: 50vw;
  height: 60vh;
  border: 1px solid;
  margin: 0 auto;
  margin-top: 5vh;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login-input-box {
  width: 40vw;
  height: 45vh;
  border: 1px solid;
  margin-top: 2vh;
}
</style>
