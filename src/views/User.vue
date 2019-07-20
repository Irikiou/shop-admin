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
        <el-button type="success" plain @click="openAddUserDialog">添加用户</el-button>
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
            v-model="row.mg_state"
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
            @click=" openEditUserDialog(row.id)"
          ></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUser(row.id)"></el-button>
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
    <!-- 添加用户的模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isAddUserDialogShow"
      @close="$refs.addUserForm.resetFields()"
    >
      <el-form :model="addUserFormData" label-width="100px" :rules="addUserRules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserFormData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="addUserFormData.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户模态框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="isEditUserDialogShow"
      @close="$refs.editUserForm.resetFields()"
    >
      <el-form
        :model="editUserFormData"
        label-width="100px"
        :rules="editUserRules"
        ref="editUserForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editUserFormData.username"></el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="iseditUserDialogShow=false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
      isAddUserDialogShow: false,
      // 添加用户的表单数据
      addUserFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户表单校验规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名长度在 5 到 12个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15  个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },
      // 修改用户表单数据
      editUserFormData: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      isEditUserDialogShow: false,
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http({
        url: "users",
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
    // 分页
    onPageChange(page) {
      this.currentpage = page;
      //  重新请求数据
      this.getUserList();
    },
    // 搜索框
    search() {
      // 不论在那一夜搜索，都让页面返回第一页
      this.currentpage = 1
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
    // 用户状态切换
    async toggleState(user) {
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: "put"
      });
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
      } else {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        user.mg_state = !user.mg_state;
      }
    },
    // 删除用户
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await this.$http({
          // 向后台发送请求，删除该用户信息
          method: "delete",
          url: `users/${id}`
        });
        if (res.data.meta.status == 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          // 删除操作完成后页面跳转到第一页
          // 重新渲染
          this.currentpage = 1;
          this.getUserList();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    // 添加用户
    openAddUserDialog() {
      this.isAddUserDialogShow = true;
    },
    async addUser() {
      try {
        // 先进行表单校验，校验成功后发送请求
        await this.$refs.addUserForm.validate();
        let res = await this.$http({
          url: "users",
          method: "post",
          data: this.addUserFormData
        });
        if (res.data.meta.status == 201) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.getUserList();
          //在表单提交成功之后执行
          this.isAddUserDialogShow = false;
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (err) {}
    },
    // 编辑用户
    async openEditUserDialog(id) {
      // 1. 打开模态框
      this.isEditUserDialogShow = true;
      // 2. 使用id去后台获取用户数据，展示到模态框中
      let res = await this.$http({
        url: `users/${id}`
      });

      // console.log(res);
      this.editUserFormData = res.data.data;
    },
    async editUser() {
      try {
        await this.$refs.editUserForm.validate();
        // 向后台提交请求，修改用户数据

        let res = await this.$http({
          url: `users/${this.editUserFormData.id}`,
          method: "put",
          data: {
            mobile: this.editUserFormData.mobile,
            email: this.editUserFormData.email
          }
        });

        console.log(res);
        if (res.data.meta.status == 200) {
          // 提示用户更新成功
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          // 刷新列表
          this.getUserList();
          // 关闭模态框
          this.isEditUserDialogShow = false;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
      } catch (err) {}
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

