<template>
  <div class="goods-add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }"></el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="步骤一" description="基本信息"></el-step>
      <el-step title="步骤二" description="商品图片"></el-step>
      <el-step title="步骤三" description="商品内容"></el-step>
    </el-steps>
    <!-- 添加标签页 -->
    <!--  v-model="activeName":绑定当前正在激活的标签页的name -->
    <el-tabs
      tab-position="left"
      style="margin-top:20px"
      @tab-click="changeTab"
      v-model="activeName"
    >
      <el-tab-pane label="基本信息" name="base">
        <el-form ref="form" :model="addGoodsFormData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsFormData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsFormData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsFormData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsFormData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateOptions"
              v-model="addGoodsFormData.catArr"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addGoodsFormData.is_promote" :label="1">是</el-radio>
            <el-radio v-model="addGoodsFormData.is_promote" :label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1,'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <!-- 富文本编辑器 -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="onFileUploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content" style="height:400px;">
        <quill-editor v-model="addGoodsFormData.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 引入富文本编辑器
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      activeStep: 0,
      activeName: "basic",
      addGoodsFormData: {
        goods_name: "",
        catArr: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        is_promote: 0,
        pics: []
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    });
    console.log(res);
    this.cateOptions = res.data.data;
  },
  methods: {
    onFileUploadSuccess(res) {
      this.addGoodsFormData.pics.push({
        pic: res.data.tmp_path
      });
    },
    next(index, activeName) {
      this.activeStep = index;
      this.activeName = activeName;
    },
    changeTab(tab) {
      //   console.log(tab);
      this.activeStep = +tab.index;
    },
    async addGoods() {
      let newGoods = {
        goods_cat: this.addGoodsFormData.catArr.pop(),
        goods_name: this.addGoodsFormData.goods_name,
        goods_price: this.addGoodsFormData.goods_price,
        goods_number: this.addGoodsFormData.goods_number,
        goods_weight: this.addGoodsFormData.goods_weight,
        goods_introduce: this.addGoodsFormData.goods_introduce,
        is_promote: this.addGoodsFormData.is_promote,
        pics: addGoodsFormData.pics
      };
      // console.log(this.addGoodsFormData);
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: newGoods
      });
      if (res.data.meta.status == 201) {
        this.$router.push("/goods");
      }
    }
  }
};
</script>
<style>
.ql-container {
  height: 200px;
}
</style>

