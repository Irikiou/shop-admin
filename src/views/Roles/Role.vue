<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <!-- expand-change:表示当前行展开或者关闭时触发的事件 -->
    <el-table :data="roleList" stripe style="width: 100%" @expand-change="getRolesRight">
      <!-- 给列加上type="expand"可以实现展开行的效果 -->
      <el-table-column type="expand">
        <template>你好</template>
      </el-table-column>

      <!-- type="index"自动生成序号列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
          <el-button type="success" plain size="mini" icon="el-icon-check">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: []
    };
  },
  methods: {
    async getRolesRight(row, expandedRows) {
      //   console.log(row, expandedRows);
      if (expandedRows.length) {
        // console.log("展开");
        // 获取当前用户的权限信息
        let res = await this.$http({
          url: `roles/${row.id}`
        });
        console.log(res);
      } else {
        console.log("关闭");
      }
    }
  },
  async created() {
    let res = await this.$http({
      url: "roles"
    });
    // console.log(res);
    this.roleList = res.data.data;
  }
};
</script>
<style>
</style>

