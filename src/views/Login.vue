<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :span="8">
      <el-form ref="form" :model="form" label-width="80px" class="loginform" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">登录</el-button>
          <el-button>设置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {}
};
</script>
<style>
.row-bg {
  background-color: #2d434c;
  height: 100%;
}
.loginform {
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 10px;
}
</style>
