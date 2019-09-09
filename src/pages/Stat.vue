<template>
  <div class="content">
    <div class="wrapper">
      <h1>作业统计小工具</h1>
      <div class="input-group">
        <label for="course">请选择课程</label>
        <Select v-model="selected" placeholder="请选择" @change="handleCourseChange">
          <Option
            v-for="course in courses"
            :key="course.courseId"
            :value="course.courseId"
            :label="course.name"
          />
        </Select>
      </div>
      <div class="input-group">
        <label for="course">请选择实验</label>
        <Select v-model="test_name" placeholder="请选择">
          <Option v-for="test in tests" :key="test" :value="test" :label="test" />
        </Select>
      </div>
      <div>
        <Button type="primary" @click="handleStat">统计</Button>
        <Button type="primary" @click="handleDownload">批量下载</Button>
        <a ref="download" :href="download.url" :download="download.name">{{download?'点击下载':''}}</a>
      </div>
      <h3 class="title">
        共
        <span id="total">{{stus.length}}</span>
        人，
        <span id="rest">{{stus.length-jobs.length}}</span>
        人未交
      </h3>
      <Row>
        <Col :span="12">
          <div class="item no">
            <h3>未提交</h3>
            <Table :data="restPeople" height="550">
              <table-column prop="number" label="学号" width="180" />
              <table-column prop="name" label="姓名" width="180" />
            </Table>
          </div>
        </Col>
        <Col :span="12">
          <div class="item yes">
            <h3>已提交</h3>
            <Table :data="job" height="550">
              <table-column prop="number" label="学号" width="180" />
              <table-column prop="name" label="姓名" width="180" />
              <table-column prop="modifyAt" label="提交时间" width="220"></table-column>
            </Table>
          </div>
        </Col>
      </Row>
      <div class="box"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  Button,
  Select,
  Option,
  Message,
  Table,
  TableColumn,
  Row,
  Col,
  Loading
} from "element-ui";
export default {
  name: "Stat",
  components: {
    Button,
    Select,
    Option,
    Table,
    TableColumn,
    Row,
    Col
  },
  data() {
    return {
      selected: "",
      test_name: "",
      courses: [],
      tests: [],
      rests: [],
      stus: [],
      jobs: [],
      job: [],
      restPeople: [],
      download: {}
    };
  },
  mounted() {
    let loading = Loading.service({
      fullscreen: true,
      text: "努力加载中，请稍后...",
      background: "rgba(0, 0, 0, 0.8)"
    });
    axios.get("/api/courses").then(response => {
      let res = response.data;
      if (response.data) {
        loading.close();
      }
      if (res.code === 1) {
        Message.error("获取课程失败");
      }
      if (res.code === 0) {
        this.courses = res.data;
      }
    });
    axios.get("/api/stus").then(response => {
      // console.log(response.data);
      if (response.data) {
        loading.close();
      }
      if (response.data.code === 0) {
        this.stus = response.data.data;
      }
      if (response.data.code === 1) {
        Message.error("获取学生数据失败");
      }
    });
  },
  methods: {
    handleDownload() {
      let loading = Loading.service({
        fullscreen: true,
        text: "努力压缩中，请稍后...",
        background: "rgba(0, 0, 0, 0.8)"
      });
      axios
        .get("/api/download", {
          params: {
            testName: this.test_name,
            courseId: this.selected
          }
        })
        .then(res => {
          console.log(res.data);
          if (response.data) {
            loading.close();
          }
          if (res.data.code === 0) {
            this.download = res.data.data;
            this.$refs.download.click();
          }
        });
    },
    handleCourseChange(val) {
      this.tests = this.courses[parseInt(val) - 1].tests;
    },
    handleStat() {
      let loading = Loading.service({
        fullscreen: true,
        text: "努力加载中，请稍后...",
        background: "rgba(0, 0, 0, 0.8)"
      });

      axios
        .get("/api/jobs", {
          params: {
            testName: this.test_name,
            courseId: this.selected
          }
        })
        .then(response => {
          // console.log(response.data);
          if (response.data) {
            loading.close();
          }
          if (response.data.code === 0) {
            if (response.data.data.length !== 0) {
              this.job = response.data.data;
              let simpleStus = [];
              let names = [];
              for (let value of this.stus) {
                simpleStus.push(value.name.trim());
              }

              for (let value of this.job) {
                names.push(value.name.trim());
              }
              // console.log(simpleStus, names);

              let res_yes = simpleStus.filter(val => {
                return names.indexOf(val.trim()) > -1;
              });

              let res_no = simpleStus.filter(val => {
                return names.indexOf(val.trim()) === -1;
              });

              this.restPeople = this.stus.filter(item => {
                return names.indexOf(item.name.trim()) === -1;
              });

              this.stus = simpleStus;
              this.jobs = res_yes;
              this.rests = res_no;
            } else {
              Message.success("暂时无数据");
            }
          }
          if (response.data.code === 1) {
            Message.error("获取数据失败");
          }
        });
    }
  }
};
</script>

<style>
.content {
  padding: 10px 100px;
  width: 1200px;
  margin: 10px auto;
  background: rgba(255, 255, 255, 0.6);
}
.input-group {
  margin-bottom: 15px;
}
.input-group label {
  display: inline-block;
  width: 100px;
  padding-right: 10px;
  text-align: right;
}
.input-group input {
  width: 300px;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  padding: 0 10px;
}
</style>