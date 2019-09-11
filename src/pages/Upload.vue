<template>
  <div class="content">
    <!-- <div ref="content"> -->
    <h1 class="title">作业提交系统 V2.0</h1>
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
    </div>
    <div class="input-group">
      <label for="course">实验</label>
      <Select v-model="test_name" placeholder="请选择实验">
        <Option v-for="test in tests" :key="test" :value="test" :label="test" />
      </Select>
    </div>
    <div class="input-group">
      <label for="number">学号</label>
      <Input style="width: auto;" v-model="number" placeholder="请输入学号" />
    </div>
    <div class="input-group">
      <label for="name">姓名</label>
      <Input style="width: auto;" v-model="name" placeholder="请输入姓名" />
    </div>
    <div class="input-group">
      <label for="file">请选择文件</label>
      <input type="file" ref="file" hidden @change="handleFileChange" />
      <Button type="primary" icon="el-icon-plus" @click="handleSelect">选择文件</Button>
      <div></div>
      <span class="fileName">
        <i v-if="fileName" class="el-icon-document"></i>
        {{fileName}}
      </span>
    </div>

    <div class="input-group">
      <Button class="sub" type="primary" @click="handleSubmit">提交</Button>
    </div>
    <div class="upload-progress" v-if="isShowUploadProgress">
      <el-progress
        class="upload-progress-inner"
        :color="colors"
        type="circle"
        :percentage="progress"
      ></el-progress>
      <p class="upload-text">努力上传中，请稍等</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  Button,
  Input,
  Select,
  Option,
  Message,
  Loading,
  Progress
} from "element-ui";

axios.defaults.baseURL = "http://139.159.201.22:4000";
// axios.defaults.baseURL = "http://192.168.3.25:4000";

export default {
  name: "Upload",
  components: {
    Button,
    Input,
    Select,
    Option,
    ElProgress: Progress
  },
  data() {
    return {
      courseSelected: "",
      name: "",
      number: "",
      courses: [],
      fileName: "",
      tests: [],
      test_name: "",
      progress: 0,
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
    
    axios.get("/courses").then(response => {
    // axios.get("/api/courses").then(response => {
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
  },
  methods: {
    /**
     * 课程改变实验改变
     */
    handleCourseChange(val) {
      this.tests = this.courses[parseInt(val) - 1].tests;
    },
    /**
     * 获取文件
     */
    handleFileChange(e) {
      this.fileName = e.target.files[0].name;
    },
    /**
     * 通过点击按钮触 input file
     */
    handleSelect() {
      this.$refs.file.click();
    },
    /**
     * 提交按钮
     */
    handleSubmit() {
      if (!this.courseSelected) {
        Message.error("请选择课程");
        return;
      }
      if (!this.test_name) {
        Message.error("请选择实验");
        return;
      }
      if (!this.number) {
        Message.error("学号不能为空");
        return;
      }
      if (!this.name) {
        Message.error("姓名不能为空");
        return;
      }
      if (!this.$refs.file.files[0]) {
        Message.error("请选择要上传的文件");
        return;
      }
      // 将进度初始化为0
      this.progress = 0;
      // 点击提交按钮后，显示弹出框
      this.isShowUploadProgress = true;

      // 利用 FormData 上传数据和文件
      let param = new FormData();
      param.append("number", this.number);
      param.append("name", this.name);
      param.append("courseId", this.courseSelected);
      param.append("testName", this.test_name);
      param.append("files", this.$refs.file.files[0]);

      // 保存请求
      axios
        .post("/save", param, {
        // .post("/api/save", param, {
          "Content-Type": "multipart/form-data",
          onUploadProgress: progressEvent => {
            // 上传进度条
            let num = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            this.progress = num;
          }
        })
        .then(response => {
          if (response.data.code === 0) {
            Message.success("上传成功");
          }
          if (response.data.code === 1) {
            Message.error(
              "上传失败，检查是否有网络，若还无法解决，请联系管理员"
            );
          }
          // code 为 2 表示用户不存在
          if (response.data.code === 2) {
            Message.warning(response.data.msg);
          }

          this.isShowUploadProgress = false;
        })
        .catch(error => {
          Message.error(error);
          this.isShowUploadProgress = false;
        });
    }
  }
};
</script>

<style>
.content {
  width: 460px;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 3px 3px 3px #ccc;
  margin: 100px auto;
  background: rgba(255, 255, 255, 0.9);
}
.title {
  text-align: center;
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
.sub {
  width: 100%;
}
.fileName {
  /* display: inline-block; */
  padding-left: 110px;
  line-height: 40px;
  /* height: 30px;; */
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
</style>