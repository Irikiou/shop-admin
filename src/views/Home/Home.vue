<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          <img src="../../assets/logo.png" alt />
        </el-col>
        <el-col>
          <h1>品优购后台管理系统</h1>
        </el-col>
        <el-col :span="6">
          <div class="header-right">
            <span>
              欢迎39期星耀会员
              <a href="#" @click.prevent="logout">退出</a>
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
          <!-- :index="menu1.id+ ''"后加""是因为页面需要的是一个字符串，所以将后台发送回来的数据转换成字符串 -->
          <el-submenu v-for="menu1 in menusList" :key="menu1.id" :index="menu1.id+ ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu1.authName}}</span>
            </template>
            <!-- el-menu-item:这个组件是每一个没有子菜单项的菜单 -->
            <el-menu-item v-for="menu2 in menu1.children" :key="menu2.id" :index="'/'+ menu2.path">
              <i class="el-icon-menu"></i>
              <span>{{menu2.authName}}</span>
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
export default {
  data() {
    return {
      menusList: []
    };
  },
  async created() {
    let res = await this.$http({
      url: "menus"
    });
    // console.log(res);
    this.menusList = res.data.data;
  },
  methods: {
    logout() {
      // 清空token
      localStorage.removeItem("token");
      // 跳转页面
      this.$router.push("/Login");
    }
  }
};
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
