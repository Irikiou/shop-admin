<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }"></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="showAddCateDialog">添加分类</el-button>
    <!-- 表格 -->
    <el-table stripe ref="singleTable" :data="categoryList" style="width: 100%">
      <!-- file-icon指的就是叶子节点的图标
            folder-icon指的就是可展开的项的图标
            prop 指的就是当前列要显示的数据的属性名称
            label 指的就是表头 
            treeKey 节点的唯一表示
            parentKey 数据的父节点id
            childKey 当前节点的所有子节点存放的属性的名字 默认是children

            indent-size是用来设置每个层级之间的缩进距离的
            设置indent-size 需要同时指定 层级属性 level-key

            level-key:    设置为数据中标识层级的属性名即可
      -->
      <el-table-tree-column
        file-icon="el-icon-notebook-2"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        tree-key="cat_id"
        parent-key="cat_pid"
        :indent-size="50"
        level-key="cat_level"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="120">
        <template v-slot="{row}">{{row.cat_deleted ? "否":"是"}}</template>
      </el-table-column>
      <el-table-column property="cat_level" label="层级"></el-table-column>
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
      @current-change="pageChange"
    ></el-pagination>
    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="isShowAddCateDailog">
      <el-form ref="addCateForm" :model="addCateFormData" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="addCateFormData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            v-model="addCateFormData.parentArray"
            :options="cateOptions"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCateDailog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const ELtreeGrid = require("element-tree-grid");
// console.log(ELtreeGrid.name);
//  [ELtreeGrid.name]其实就是el-table-tree-column
// 若要使用该组件的话，直接使用el-table-tree-column标签即可

export default {
  components: {
    [ELtreeGrid.name]: ELtreeGrid
  },
  data() {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      isShowAddCateDailog: false,
      addCateFormData: {
        cat_name: "",
        parentArray: []
      },
      // 添加分类的时候，所有的父类列表，最终是要展示在级联选择器中的
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    async addCate() {
      // 1.获取表单数据
      let cat_level = this.addCateFormData.parentArray.length;
      let cat_name = this.addCateFormData.cat_name;
      let cat_pid = this.addCateFormData.parentArray.pop() || 0;
      // 2.向后台提交数据
      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_level,
          cat_name,
          cat_pid
        }
      });
      console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.isShowAddCateDailog = false;
        // 清空表单
        this.$refs.addCateForm.resetFields();
        // 重新获取商品列表数据
        this.getCategoryList();
      }
    },
    async showAddCateDialog() {
      // 1.获取分类列表数据
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      this.cateOptions = res.data.data;
      this.isShowAddCateDailog = true;
    },
    pageChange(currentPage) {
      this.pagenum = currentPage;
      this.getCategoryList();
    },
    async getCategoryList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.categoryList = res.data.data.result;
      this.total = res.data.data.total;
    }
  }
};
</script>

<style>
</style>
