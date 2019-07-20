import { setUser } from '../../apis'
export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      let validateEmailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      } else if (!validateEmailReg.test(value)) {
        return callback(new Error('邮箱格式不正确'))
      }
    }
    const validateMobile = (rule, value, callback) => {
      let RegPhone = /^1[3|4|5|8][0-9]\d{4,8}$/
      if (!value) {
        return callback(new Error('手机不能为空'))
      } else if (!RegPhone.test(value)) {
        return callback(new Error('手机号码格式错误'))
      }
    }
    return {
      userList: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyword: '',
      isAddUserDialogShow: false,
      // 添加用户的表单数据
      addUserFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单校验规则
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '用户名长度在 5 到 12个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15  个字符',
            trigger: 'change'
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '邮箱格式不正确',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',
            trigger: 'change'
          }
        ]
      },
      // 修改用户表单数据
      editUserFormData: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      isEditUserDialogShow: false,
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '邮箱格式不正确',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$http({
        url: 'users',
        params: {
          query: this.keyword,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        // 普通赋值
        // this.userList = res.data.data.users;
        // 解构赋值
        let {
          data: { data, meta }
        } = res
        console.log(res)
        this.userList = data.users
        this.total = data.total
      })
    },
    // 分页
    onPageChange(page) {
      this.currentpage = page
      //  重新请求数据
      this.getUserList()
    },
    // 搜索框
    search() {
      // 不论在哪一页搜索，都能返回第一页
      this.currentpage = 1
      this.getUserList()
    },
    handle(scope) {
      console.log(scope)
    },
    handleOpenDialog(row) {
      console.log(row)
      this.dialogVisible = true
      this.updateInfo = row
    },
    // 用户状态切换
    async toggleState(user) {
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: 'put'
      })
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
      } else {
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
        user.mg_state = !user.mg_state
      }
    },
    // 删除用户
    async delUser(id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$http({
          // 向后台发送请求，删除该用户信息
          method: 'delete',
          url: `users/${id}`
        })
        if (res.data.meta.status == 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          // 删除操作完成后页面跳转到第一页
          // 重新渲染
          this.currentpage = 1
          this.getUserList()
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 添加用户
    openAddUserDialog() {
      this.isAddUserDialogShow = true
    },
    async addUser() {
      try {
        // 先进行表单校验，校验成功后发送请求
        await this.$refs.addUserForm.validate()
        let res = await this.$http({
          url: 'users',
          method: 'post',
          data: this.addUserFormData
        })
        if (res.data.meta.status == 201) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            duration: 1000
          })
          this.getUserList()
          //在表单提交成功之后执行
          this.isAddUserDialogShow = false
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      } catch (err) {}
    },
    // 编辑用户
    async openEditUserDialog(id) {
      // 1. 打开模态框
      this.isEditUserDialogShow = true
      // 2. 使用id去后台获取用户数据，展示到模态框中
      let res = await this.$http({
        url: `users/${id}`
      })

      // console.log(res);
      this.editUserFormData = res.data.data
    },
    async editUser() {
      try {
        await this.$refs.editUserForm.validate()
        // 向后台提交请求，修改用户数据

        let res = await this.$http({
          url: `users/${this.editUserFormData.id}`,
          method: 'put',
          data: {
            mobile: this.editUserFormData.mobile,
            email: this.editUserFormData.email
          }
        })

        console.log(res)
        if (res.data.meta.status == 200) {
          // 提示用户更新成功
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
          // 刷新列表
          this.getUserList()
          // 关闭模态框
          this.isEditUserDialogShow = false
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 1000
          })
        }
      } catch (err) {}
    }
  }
}
