<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <!-- gutter="20"指定每一栏之间的间隔，默认间隔为 0。 -->
    <!-- native:原生事件 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="keyword"
          @keyup.enter.native="search"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- tab表格 -->
    <!-- data：用来绑定表格要展示的数据对象 -->
    <!-- stripe:设置隔行变色 -->
    <el-table :data="userList" stripe style="width: 100%">
      <!-- prop:设置当前列中要展示的数据的属性名 -->
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 如果当前列中不会直接把数据展示出来，就没有必要设置prop属性 -->
      <el-table-column label="用户状态">
        <!-- 在这里无法直接获取到每一行的数据，数据储存在el-table表格组件中 -->
        <!-- 想要获取到每一行的数据，就要通过作用域插槽的方式，把数据接收到-->
        <template v-slot="{row}">
          <el-switch
            v-model="row.type"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit"
            @click="handleOpenDialog(row)"
          ></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
          <el-button type="success" plain size="mini" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @current-change="onPageChange" 这个是页码发生改变的时候触发的事件-->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="onPageChange"
    ></el-pagination>
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form :model="updateInfo" :rules="rules">
        <el-form-item label="用户名:" label-width="120px" prop="username">
          <el-button type="text" disabled>{{updateInfo.username}}</el-button>
        </el-form-item>
        <el-form-item label="邮箱:" label-width="120px" prop="email">
          <el-input v-model="updateInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="电话:" label-width="120px" prop="mobile">
          <el-input v-model="updateInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { setUser } from "../../src/apis/index";
export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      let validateEmailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      } else if (!validateEmailReg.test(value)) {
        return callback(new Error("邮箱格式不正确"));
      }
    };
    const validateMobile = (rule, value, callback) => {
      let RegPhone = /^1[3|4|5|8][0-9]\d{4,8}$/;
      if (!value) {
        return callback(new Error("手机不能为空"));
      } else if (!RegPhone.test(value)) {
        return callback(new Error("手机号码格式错误"));
      }
    };
    return {
      userList: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyword: "",
      title: "修改用户信息",
      dialogVisible: false,
      updateInfo: {},
      rules: {
        email: [{ validator: validateEmail, trigger: "blur" }],
        mobile: [{ validator: validateMobile, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      axios({
        url: "http://localhost:8888/api/private/v1/users",
        params: {
          query: this.keyword,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        // 普通赋值
        // this.userList = res.data.data.users;
        // 解构赋值
        let {
          data: { data, meta }
        } = res;
        console.log(res);
        this.userList = data.users;
        this.total = data.total;
      });
    },
    onPageChange(page) {
      this.currentpage = page;
      //  重新请求数据
      this.getUserList();
    },
    search() {
      this.getUserList();
    },
    handle(scope) {
      console.log(scope);
    },
    handleOpenDialog(row) {
      console.log(row);
      this.dialogVisible = true;
      this.updateInfo = row;
    },
    async toggleState(user) {
      // console.log(user);
      let res = await axios({
        method: "put",
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
      }
    }
  }
};
</script>
<style>
.el-breadcrumb.breadcrumb {
  height: 50px;
  background-color: #d4dae0;
  font-size: 16px;
  line-height: 50px;
  padding-left: 10px;
  margin-bottom: 10px;
}
</style>

