<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          <img src="../assets/logo.png" alt />
        </el-col>
        <el-col>
          <h1>品优购后台管理系统</h1>
        </el-col>
        <el-col :span="6">
          <div class="header-right">
            <span>
              欢迎39期星耀会员
              <a href="#">退出</a>
            </span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!--  default-active="2"//设置默认高亮的菜单栏，赋值的内容为菜单项的index值 -->
        <!-- :unique-opened="true"参数要求是一个布尔值，所以前面需要加冒号动态绑定，否则true是一个字符串 -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <!-- el-submenu index="1"：当前菜单项的id,唯一标识 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!-- el-menu-item:这个组件是每一个没有子菜单项的菜单 -->
            <el-menu-item index="/user">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span>数据列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {};
</script>
<style>
.el-container {
  height: 100%;
}
.el-container .el-header {
  background-color: #b3c1cd;
  padding: 0;
}
.el-container .el-header img {
  width: 200px;
}
.el-container .el-header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: bolder;
  padding: 0;
  margin: 0;
  text-align: center;
}
.header-right {
  font-weight: bolder;
  text-align: right;
  padding-right: 15px;
}
.el-container .el-header div a {
  color: #ffa500;
}
.el-menu-vertical-demo.el-menu {
  height: 100%;
}
</style>
