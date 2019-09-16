<template>
  <div class="content">
    <div class="wrapper">
      <h1>作业统计系统 V2.1</h1>
      <div class="input-group">
        <label for="number">账号</label>
        <Input style="width: auto;" v-model="username" placeholder="请输入账号" />
        <label for="number">密码</label>
        <Input style="width: auto;" type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <!-- <div class="input-group">
        <label for="number">密码</label>
        <Input style="width: auto;" type="password" v-model="password" placeholder="请输入密码" />
      </div>-->
      <div class="input-group">
        <label for="course">课程</label>
        <Select v-model="courseSelected" placeholder="请选择课程" @change="handleCourseChange">
          <Option
            v-for="course in courses"
            :key="course.courseId"
            :value="course.courseId"
            :label="course.name"
          />
        </Select>
        <label for="course">实验</label>
        <Select v-model="test_name" placeholder="请选择实验" @change="handleTestChange">
          <Option v-for="test in tests" :key="test" :value="test" :label="test" />
        </Select>
      </div>
      <div>
        <Button type="primary" @click="handleStat">统计</Button>
        <Button type="primary" @click="handleDownload">获取批量下载链接</Button>
        <Button type="success" v-show="download.url">
          <a
            class="download"
            ref="download"
            :href="download.url"
            :download="download.name"
          >{{'文件已获取，点击下载'}}</a>
        </Button>
      </div>
      <el-row>
        <el-col :span="10">
          <div class="item no">
            <h3>
              共
              <span id="total">{{stuObj.length}}</span>
              人
              <span class="no-submit">未提交 ({{stuObj.length-job.length}})</span>
            </h3>
            <Table :data="restPeople" height="calc(100vh - 420px)">
              <table-column type="index" label="编号" width="100"></table-column>
              <table-column prop="number" label="学号" width="180" />
              <table-column prop="name" label="姓名" width="180" />
            </Table>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="item yes">
            <h3>已提交 ({{job.length}})</h3>
            <Table :data="job" height="calc(100vh - 420px)">
              <table-column type="index" label="编号" width="100"></table-column>
              <table-column prop="number" label="学号" width="180" />
              <table-column prop="name" label="姓名" width="180" />
              <table-column prop="modifyAt" label="提交时间" width="220">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.modifyAt }}</span>
                </template>
              </table-column>
            </Table>
          </div>
        </el-col>
      </el-row>
      <div class="box"></div>
    </div>
    <div class="upload-progress" v-if="isShowUploadProgress">
      <el-progress
        class="upload-progress-inner"
        :color="colors"
        type="circle"
        :percentage="progress"
      ></el-progress>
      <p class="upload-text">努力获取文件中，请稍后</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
var md5 = require("js-md5");
import {
  Button,
  Select,
  Option,
  Message,
  Table,
  TableColumn,
  Row,
  Col,
  Loading,
  Input,
  Progress,
  MessageBox
} from "element-ui";

// axios.defaults.baseURL = "http://192.168.3.25:4000";
axios.defaults.baseURL = "http://139.159.201.22:4000";

export default {
  name: "Stat",
  components: {
    Button,
    Select,
    Option,
    Table,
    TableColumn,
    ElRow: Row,
    ElCol: Col,
    Input,
    ElProgress: Progress
  },
  data() {
    return {
      classGrades: [{ name: "z软件161" }, { name: "z软件162" }],
      classGradesSelected: "",
      username: "",
      password: "",
      courseSelected: "",
      test_name: "",
      courses: [],
      tests: [],
      rests: [],
      stus: [],
      stuObj: [],
      jobs: [],
      job: [],
      restPeople: [],
      download: {},
      progress: 0,
      t_height: 200,
      isShowUploadProgress: false,
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#5cb87a", percentage: 40 },
        { color: "#1989fa", percentage: 60 },
        { color: "#6f7ad3", percentage: 80 },
        { color: "#67c23a", percentage: 100 }
      ]
    };
  },
  mounted() {
    let loading = Loading.service({
      fullscreen: true,
      text: "努力加载中，请稍后...",
      background: "rgba(0, 0, 0, 0.8)"
    });
    // axios.get("/api/courses").then(response => {
    axios.get("/courses").then(response => {
      let res = response.data;

      if (res.code === 1) {
        Message.error("获取课程失败");
      }
      if (res.code === 0) {
        this.courses = res.data;
      }
      if (response.data) {
        loading.close();
      }
    });
  },
  methods: {
    /**
     * 下载
     */
    handleDownload() {
      this.progress = 0;
      this.isShowUploadProgress = true;
      let params = {
        username: this.username,
        password: md5(this.password),
        testName: this.test_name,
        courseId: this.courseSelected
      };
      axios
        // .post("/api/download", params, {
        .post("/download", params, {
          "Content-Type": "multipart/form-data",
          onUploadProgress: progressEvent => {
            // 上传进度条
            let num = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            this.progress = num;
            if (num === 100) {
              // this.isShowUploadProgress = false;
            }
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.download = res.data.data;
            this.isShowUploadProgress = false;
          }
        });
    },
    handleCourseChange(val) {
      this.tests = this.courses[parseInt(val) - 1].tests;
      this.download = {};
    },
    handleTestChange() {
      this.download = {};
    },
    /**
     * 统计
     */
    handleStat() {
      this.download = {};
      if (!this.username) {
        Message.error("账号不能为空");
        return;
      }
      if (!this.password) {
        Message.error("密码不能为空");
        return;
      }
      if (!this.courseSelected) {
        Message.error("课程不能为空");
        return;
      }
      if (!this.test_name) {
        Message.error("实验不能为空");
        return;
      }

      let loading = Loading.service({
        fullscreen: true,
        text: "努力加载中，请稍后...",
        background: "rgba(0, 0, 0, 0.8)"
      });

      axios
        // .get("/api/stus", {
        .get("/stus", {
          params: {
            username: this.username,
            password: md5(this.password)
          }
        })
        .then(response => {
          if (response.data.code === 0) {
            // 取得学生数据
            this.stuObj = response.data.data;
            axios
              // .post("/api/jobs", {
              .post("/jobs", {
                username: this.username,
                password: md5(this.password),
                testName: this.test_name,
                courseId: this.courseSelected
              })
              .then(response => {
                // console.log(response.data);
                if (response.data) {
                  loading.close();
                }
                if (response.data.code === 2) {
                  MessageBox.warning(response.data.msg);
                }
                if (response.data.code === 0) {
                  if (response.data.data.length === 0) {
                    Message.success("暂时无数据");
                  }
                  this.job = response.data.data;
                  let simpleStus = [];
                  let names = [];

                  for (let value of this.stuObj) {
                    simpleStus.push(value.name.trim());
                  }

                  for (let value of this.job) {
                    names.push(value.name.trim());
                  }

                  let res_yes = simpleStus.filter(val => {
                    return names.indexOf(val.trim()) > -1;
                  });

                  let res_no = simpleStus.filter(val => {
                    return names.indexOf(val.trim()) === -1;
                  });

                  this.restPeople = this.stuObj.filter(item => {
                    return names.indexOf(item.name.trim()) === -1;
                  });

                  this.stus = simpleStus;
                  this.jobs = res_yes;
                  this.rests = res_no;
                }
                if (response.data.code === 1) {
                  Message.error("获取数据失败: " + response.data.msg);
                }
              });
          }
          if (response.data.code === 1) {
            Message.error("获取学生数据失败");
          }
          if (response.data) {
            loading.close();
          }
        });
    }
  }
};
</script>

<style>
.content {
  border-radius: 4px;
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
.upload-progress {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
}
.upload-progress-inner {
  margin-top: 320px;
}
.upload-text {
  color: #409eff;
  font-size: 14px;
}
.download {
  text-decoration: none;
  display: inline-block;
  color: #fff;
}
.stat_table {
  height: calc(100vh - 480px);
}
.no-submit {
  margin-left: 20px;
}
</style>