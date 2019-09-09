<template>
  <div class="content">
    <h1 class="title">作业上传系统</h1>
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
    <div class="input-group">
      <label for="number">学号</label>
      <Input style="width: auto;" v-model="number" placeholder="请输入学号" />
      <!-- <input id="number" type="text" v-model="number" placeholder="请输入学号" /> -->
    </div>
    <div class="input-group">
      <label for="name">姓名</label>
      <Input style="width: auto;" v-model="name" placeholder="请输入姓名" />
      <!-- <input id="name" type="text" v-model="name" placeholder="请输入姓名" /> -->
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
  </div>
</template>

<script>
import axios from "axios";
import { Button, Input, Select, Option, Message, Loading } from "element-ui";
export default {
  name: "Upload",
  components: {
    Button,
    Input,
    Select,
    Option
  },
  data() {
    return {
      selected: "",
      name: "",
      number: "",
      courses: [],
      fileName: "",
      tests: [],
      test_name: ""
    };
  },

  componentDidMount() {

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
  },
  methods: {
    handleCourseChange(val) {
      this.tests = this.courses[parseInt(val) - 1].tests;
    },
    handleFileChange(e) {
      this.fileName = e.target.files[0].name;
    },
    handleSelect() {
      this.$refs.file.click();
    },
    handleSubmit() {
      // console.log(this.$refs.file);
      // console.log(this.number, this.name, this.selected, this.$refs.file.files);
      if (!this.selected) {
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
      let loading = Loading.service({
        fullscreen: true,
        text: "努力上传中，请稍等...",
        background: "rgba(0, 0, 0, 0.8)"
      });

      let param = new FormData();
      param.append("number", this.number);
      param.append("name", this.name);
      param.append("courseId", this.selected);
      param.append("testName", this.test_name);
      param.append("files", this.$refs.file.files[0]);
      axios
        .post("/api/save", param, {
          "Content-Type": "multipart/form-data"
        })
        .then(function(response) {
          // console.log(response.data);
          if (response.data) {
            loading.close();
          }
          if (response.data.code === 0) {
            Message.success("上传成功");
          }
          if (response.data.code === 1) {
            Message.error(
              "上传失败，检查是否有网络，若还无法解决，请联系管理员"
            );
          }
          if (response.data.code === 2) {
            Message.warning(response.data.msg);
          }
        })
        .catch(function(error) {
          Message.error(error);
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
</style>