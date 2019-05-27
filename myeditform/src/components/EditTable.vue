<template>
  <div class="getChildCenter container">
    <table>
      <caption>信息表</caption>
      <tr style="height: 35px;" class="getChildCenter">
        <th :key="index" v-for="(data,index) in tableHead">
          <button type="text" @click="deleteLine(index)">删除</button>
        </th>
        <th></th>
      </tr>
      <tr class="getChildCenter">
        <th :key="index" v-for="(data,index) in tableHead">
          <input type="text" v-model="tableHead[index]">
        </th>
        <th>
          <button :disabled="tableHead.length>=maxTableHead" @click="addTableHead()">新增字段</button>
          <button @click="addTableData()">新增数据</button>
        </th>
      </tr>
      <tr class="getChildCenter" :key="index" v-for="(data,index) in tableData">
        <td :key="index" v-for="(tdData,index) in data">
          <input type="text" v-model="data[index]">
        </td>
        <td>
          <button @click="deleteRow(index)">删除</button>
        </td>
      </tr>
    </table>
    <!-- <button class="data-out" @click="dataOut()">导出</button>
    <input @change="dataIn($event)" type="file">-->
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: "EditTable",
  data() {
    return {
      file: ""
    };
  },
  props: {
    tableHead: {},
    tableData: {},
    maxTableHead: { default: 5 }
  },
  computed: {},
  watch: {
    tableHead: {
      handler(newval) {
        //console.log(newval);
      },
      deep: true
    }
  },
  methods: {
    // dataOut() {
    //   let headSTR = "";
    //   for (let i = 0, length = this.tableHead.length; i < length; i++) {
    //     headSTR = headSTR + this.tableHead[i];
    //     if (i != length - 1) headSTR = headSTR + ",";
    //     else headSTR = headSTR + "\n";
    //   }
    //   let dataSTR = "";
    //   for (let i = 0, length = this.tableData.length; i < length; i++) {
    //     for (let j = 0, jlength = this.tableData[i].length; j < jlength; j++) {
    //       dataSTR =
    //         dataSTR + this.tableData[i][j] + (j == jlength - 1 ? "\n" : ",");
    //     }
    //   }
    //   console.log(headSTR + dataSTR);
    //   let STR = headSTR + dataSTR;
    //   var blob = new Blob(["\uFEFF" + STR], {
    //     type: "text/csv;charset=gb2312;",
    //     endings: "native"
    //   });
    //   var a = document.createElement("a");
    //   a.download = "text.csv";
    //   a.href = URL.createObjectURL(blob);
    //   a.click();
    // },
    // dataIn(e) {
    //   const that = this;
    //   if (!e.target.files[0]) return;
    //   let file = e.target.files[0];
    //   let fileReader = new FileReader();
    //   fileReader.readAsText(file, "gb2312");
    //   fileReader.onload = e => {
    //     console.log(e.target.result);
    //     let result = e.target.result;
    //     result = result.split("\n").filter(e => e != "");
    //     that.$emit("update:tableHead", result[0].split(","));
    //     result.shift();
    //     result = result.map(element => {
    //       return element.split(",");
    //     });
    //     that.$emit("update:tableData", result);
    //   };
    // },
    addTableHead() {
      let result = this.tableHead;
      result.push("");
      this.$emit("update:tableHead", result);
      if (this.tableData == []) return;
      let newTableData = this.tableData;
      console.log(newTableData);
      for (let i = 0; i < newTableData.length; i++) {
        let length = this.tableHead.length - newTableData[i].length;
        for (let j = 0; j < length; j++) {
          newTableData[i].push("");
        }
      }
      this.$emit("update:tableData", newTableData);
    },
    addTableData() {
      let newLine = this.tableHead.map(e => "");
      // let newTableData=this.tableData;
      this.tableData.push(newLine);
      //this.$emit("update:tableData",newTableData);
    },
    deleteRow(index) {
      this.tableData.splice(index, 1);
      //this.$emit("update:tableData",this.tableData.splice(index,1))
    },
    deleteLine(index){
      this.tableHead.splice(index,1)
      for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].splice(index,1)
      }
    }
  }
};
</script>
<style scoped>
.container {
  flex-direction: column;
  align-items: center;
}
tr {
  border: 1px solid slategray;
  display: block;
  box-sizing: border-box;
}
table input {
  padding: 0px;
  border: 0px;
  display: inline-block;
  width: 90px;
  height: 70px;
  text-align: center;
  box-sizing: border-box;
}
th,td{
  height:70px;
  width:90px;
}
th input {
  font-weight: bolder;
  font-size: large;
}
th:not(:last-child),
td:not(:last-child) {
  border-right: 1px solid slategray;
}
.getChildCenter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
button {
  width: 90px;
  height: 35px;
  display: block;
}
</style>
