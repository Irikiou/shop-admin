<template>
  <!-- 相当于一个div,用来做布局 -->
  <!-- type:布局模式，可是是flex -->
  <!-- span：栅格占据的列数 -->
  <!-- justify：设置水平对齐的方式 -->
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form
        ref="loginform"
        :rules="formRules"
        :model="form"
        class="loginform"
        label-position="top"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginform')">登录</el-button>
          <el-button @click="resetForm('loginform')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
// 引入axios文件，在哪里使用就在哪里引入
import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      formRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符",
            trigger: "change" //在输入的时候做校验
          },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" } //在鼠标离开的时候做校验
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "change"
          },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  // 用asyn的方法实现登录功能
  methods: {
    async submitForm(formName) {
      let valid = await this.$refs[formName].validate();
      if (valid) {
        try {
          let res = await axios({
            url: "http://localhost:8888/api/private/v1/login",
            method: "post",
            data: this.form
          });
          if (res.data.meta.status == 200) {
            localStorage.setItem("token", res.data.data.token);
            this.$router.push("/home");
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: "error",
              duration: 1000
            });
          }
        } catch (err) {
          // catch相当于之前失败的回调
          console.log("请求发送失败", err);
        }
      } else {
        return false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
  // methods: {
  //   submitForm(formName) {
  //     // this.$refs[formName]获取到了表单对象，通过调用这个对象的validate方法，就能对表单整体校验，validate接收的是一个函数
  //     this.$refs[formName].validate(valid => {
  //       //   validate形参接收到的就是表单的校验结果
  //       // 如果成功是true，发送ajax请求;失败是false,return
  //       if (valid) {
  //         axios({
  //           url: "http://localhost:8888/api/private/v1/login",
  //           method: "post",
  //           data: this.form
  //           // 以下使用了嵌套解构
  //         }).then(({ data: { data, meta } }) => {
  //           if (meta.status == 200) {
  //             // 登录成功后，服务器会给我们返回一个数据token
  //             // 我们需要将这个token保存在本地localstorage中即可
  //             localStorage.setItem("token", data.token);
  //             this.$router.push("/home");
  //           }
  //         });
  //       } else {
  //         console.log("error submit!!");
  //         return false;
  //       }
  //     });
  //   },
  //   resetForm(formName) {
  //     this.$refs[formName].resetFields();
  //   }
  // }
};
</script>
<style>
.row-bg {
  height: 100%;
  background-color: #2d434c;
}
.loginform {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 20px;
  min-width: 400px;
}
</style>
   
