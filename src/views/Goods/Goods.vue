<template>
  <div class="goods-list">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }"></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain>添加商品</el-button>
    <!-- 表格 -->
    <el-table stripe ref="singleTable" :data="goodsList" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column property="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="changepage"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 6,
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    changepage(currentpage) {
      this.pagenum = currentpage;
      this.getGoodsList();
    },

    //   封装以便后面调用
    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.goodsList = res.data.data.goods;
      this.total = res.data.data.total;
    }
  }
};
</script>
<style>
</style>
  