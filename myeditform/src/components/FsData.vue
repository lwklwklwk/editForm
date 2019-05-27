<template>
  <div>
      <button class="data-out" @click="dataOut()">导出</button>
      <input @change="dataIn($event)" type="file">
  </div>
</template>
<script>
export default {
  /* eslint-disable */
    name:'FsData',
    props: {
      tableHead: {},
      tableData: {},
    },
    mounted(){
      
    },
    methods: {
    dataOut() {
      let headSTR = "";
      for (let i = 0, length = this.tableHead.length; i < length; i++) {
        headSTR = headSTR + this.tableHead[i];
        if (i != length - 1) headSTR = headSTR + ",";
        else headSTR = headSTR + "\n";
      }
      let dataSTR = "";
      for (let i = 0, length = this.tableData.length; i < length; i++) {
        for (let j = 0, jlength = this.tableData[i].length; j < jlength; j++) {
          dataSTR =
            dataSTR + this.tableData[i][j] + (j == jlength - 1 ? "\n" : ",");
        }
      }
      console.log(headSTR + dataSTR);
      let STR = headSTR + dataSTR;
      var blob = new Blob(["\uFEFF" + STR], {
        type: "text/csv;charset=gb2312;",
        endings: "native"
      });
      var a = document.createElement("a");
      a.download = "text.csv";
      a.href = URL.createObjectURL(blob);
      a.click();
    },
    dataIn(e) {
      const that = this;
      if (!e.target.files[0]) return;
      let file = e.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsText(file, "gb2312");
      fileReader.onload = e => {
        console.log(e.target.result);
        let result = e.target.result;
        result = result.split("\n").filter(e => e != "");
        that.$emit("update:tableHead", result[0].split(","));
        result.shift();
        result = result.map(element => {
          return element.split(",");
        });
        that.$emit("update:tableData", result);
      };
    },
  }
}
</script>
<style  scoped>
button{
  width:90px;
  height:35px;
  display: block
}
</style>
