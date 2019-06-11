<template>
  <div>
    <div value="first" class="login-box" v-if="!ifLogin">
      <el-tabs v-model="tabsChoose">
        <el-tab-pane class="container" label="新建表格" name="first">
          <div style="margin-top:10vh">
            <span>新建表格名字:</span>
            <el-input v-model="newTabName"></el-input>
          </div>
          <el-button style="margin-top:5vh" @click="createTabName">新建</el-button>
        </el-tab-pane>
        <el-tab-pane class="container" label="连接至已有表格" name="second">
          <div style="margin-top:10vh">
            <span>待连接表格名字:</span>
            <el-input v-model="linkTabName"></el-input>
          </div>
          <el-button style="margin-top:5vh" @click="linkTab">连接</el-button>
        </el-tab-pane>
        <el-tab-pane class="container" label="离线模式" name="third">
          <el-button style="margin-top:5vh" @click="localMode">使用离线模式</el-button>
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
          <template slot="header" slot-scope="scope">
            <div class="head-box">
              <span>{{scope.column.label}}</span>
              <el-button
                class="delete-head"
                @click="deleteHead(scope.$index)"
                style="margin-left:20px;"
                size="mini"
                type="danger"
                icon="el-icon-close"
                circle
              ></el-button>
            </div>
            <el-input
              v-if="showHeadEdit&&editTableHead[scope.$index]"
              v-model="editTableHead[scope.$index]['label']"
              type="text"
            ></el-input>
          </template>
          <template slot-scope="scope">
            <p>{{scope.row[item.prop]}}</p>
            <el-input
              v-if="showEdit[scope.$index]!=undefined&&showEdit[scope.$index]"
              v-model="editTableData[scope.$index][item.prop]"
              type="text"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-button @click="editHead">编辑表头</el-button>
            <el-button :disabled="showHeadEdit" @click="addHead">添加表头</el-button>
            <el-button v-if="showHeadEdit" @click="completeEditHead">完成</el-button>
            <el-button v-if="showHeadEdit" @click="cancelHeadEdit">取消</el-button>
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
      tabsChoose: "first",
      //表格数据
      tableHead: [],
      tableData: [],
      //编辑时的临时变量
      editTableData: [],
      editTableHead: [],
      count:1,
      mode: "local",
      showEdit: [],
      showHeadEdit: false,
      ifLogin: false,
      newTabName: "",
      linkTabName: ""
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
    localMode() {
      this.mode = "local";
      this.ifLogin = true;
    },

    /* 表头相关操作 */
    addHead() {
      if (this.mode != "online") {
        this.count++;
        this.tableHead.push({
          prop: this.count.toString(),
          label: "新建列"
        });
      } else {
        this.socket.emit("addHead");
      }
    },
    deleteHead(index) {
      if (this.mode != "online") {
        let prop = this.tableHead[index].prop;
        console.log(prop);
        this.tableData.forEach(element => {
          delete element[prop];
        });
        console.log(this.tableData);
        this.tableHead.splice(index, 1);
      } else {
        this.socket.emit("deleteHead", index);
      }
    },
    editHead() {
      this.showHeadEdit = true;
      this.editTableHead = JSON.parse(JSON.stringify(this.tableHead));
    },
    cancelHeadEdit() {
      this.showHeadEdit = false;
    },
    completeEditHead() {
      if (this.mode != "online") {
        this.tableHead = JSON.parse(JSON.stringify(this.editTableHead));
        this.showHeadEdit = false;
      } else {
        this.socket.emit(
          "editHead",
          JSON.parse(JSON.stringify(this.editTableHead))
        );
        this.showHeadEdit = false;
      }
    },
    /* 表行相关操作 */
    addRow() {
      if (this.mode != "online") {
        this.tableData.push({});
      } else {
        this.socket.emit("addRow");
      }
    },
    completeEdit(index, row) {
      if (this.mode != "online") {
        console.log('此行修改',this.editTableData[index]);
        this.tableData[index] = this.editTableData[index];
        
      } else {
        this.socket.emit("editRow", {index:index,data:this.editTableData[index]});
      }
      this.$set(this.showEdit, index, false);
    },
    cancelEdit(index) {
      this.$set(this.showEdit, index, false);
    },
    handleEdit(index, row) {
        this.$set(this.showEdit, index, true);
        this.editTableData = JSON.parse(JSON.stringify(this.tableData));
    },
    handleDelete(index, row) {
      if (this.mode != "online") {
        this.tableData.splice(index, 1);
        this.$set(this.showEdit, index, true);
      }
      else{
        this.socket.emit('deleteRow',index);
      }
    },

    /*  连接相关 */
    //创建新表
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
    //连接至表
    linkTab() {
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
          that.mode = "online";
          that.metaToData(res.tableMeta);
          that.socket = io("http://127.0.0.1:3000");
          that.socket.emit("setGroup", that.linkTabName);
          that.socket.on("tableData", msg => {
            that.metaToData(msg);
            console.log("收到表格信息", msg);
          });
          that.$parent.$parent.$parent.changeName(that.linkTabName);
          that.socket.on("test", msg => {});
          that.ifLogin = true;
        })
        .catch(err => {
          console.log(err);
        });
    },

    /* 工具函数 */
    metaToData(tableMeta) {
      //console.log(tableMeta);
      this.tableHead = tableMeta.tableHead;
      this.tableData = tableMeta.tableData;
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
.delete-head {
  display: none;
}
.head-box:hover .delete-head {
  display: inline-block;
}
</style>
