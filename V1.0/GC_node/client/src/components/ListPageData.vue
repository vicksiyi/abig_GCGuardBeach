<template>
  <div>
    <Table :loading="loading" border :columns="columns7" :data="data6"></Table>
    <div class="page_list">
      <Page :total="100" show-elevator />
    </div>
  </div>
</template>

<script>
import https from "../https";

export default {
  name: "ListPageData",
  props: {},
  data() {
    return {
      loading: true,
      columns7: [
        {
          title: "姓名",
          key: "name",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.name)
            ]);
          }
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "权限",
          key: "identity"
        },
        {
          title: "密码",
          key: "password"
        },
        {
          title: "Action",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data6: [] // 数据
      // manageUser:["姓名","邮箱","权限","密码"]
    };
  },
  methods: {
    show(index) {
      // this.$Modal.info({
      //   name: "User Info",
      //   content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      // });
      this.$Modal.confirm({
        okText: "修改",
        title: "管理员",
        onOk: () => {
          console.log(this.data6[index]);
        },
        render: h => {
          return h("div", {}, [
            h("div", {}, [
              // 姓名
              h(
                "div",
                {
                  style: {
                    color: "#808695",
                    marginBottom: "5px"
                  }
                },
                [
                  h(
                    "div",
                    {
                      style: {
                        color: "#808695",
                        marginBottom: "5px"
                      }
                    },
                    "姓名"
                  ),
                  h("Input", {
                    props: {
                      value: this.value,
                      autofocus: true,
                      placeholder: this.data6[index].name
                    },
                    on: {
                      input: val => {
                        this.value = val;
                        this.data6[index].name = val;
                      }
                    }
                  })
                ]
              ),
              // 邮箱
              h(
                "div",
                {
                  style: {
                    color: "#808695",
                    marginBottom: "5px"
                  }
                },
                [
                  h(
                    "div",
                    {
                      style: {
                        color: "#808695",
                        marginBottom: "5px"
                      }
                    },
                    "邮箱"
                  ),
                  h("Input", {
                    props: {
                      value: this.value,
                      autofocus: true,
                      placeholder: this.data6[index].email
                    },
                    on: {
                      input: val => {
                        this.value = val;
                        this.data6[index].email = val;
                      }
                    }
                  })
                ]
              ),
              // 权限
              h(
                "div",
                {
                  style: {
                    color: "#808695",
                    marginBottom: "5px"
                  }
                },
                [
                  h(
                    "div",
                    {
                      style: {
                        color: "#808695",
                        marginBottom: "5px"
                      }
                    },
                    "权限"
                  ),
                  h(
                    "Select",
                    {
                      props: {
                        vModel: "model6"
                      },
                      style: {
                        width: "200px"
                      },
                      on:{
                        select:val=>{
                          console.log(val,'ok')
                        }
                      }
                    },
                    [
                      h(
                        "Option",
                        {
                          props: {
                            value: "管理员"
                          }
                        },
                        "管理员"
                      ),
                      h(
                        "Option",
                        {
                          props: {
                            value: "超级管理员"
                          }
                        },
                        "超级管理员"
                      )
                    ]
                  )
                ]
              ),
              h(
                "div",
                {
                  style: {
                    color: "#808695",
                    marginBottom: "5px"
                  }
                },
                [
                  h(
                    "div",
                    {
                      style: {
                        color: "#808695",
                        marginBottom: "5px"
                      }
                    },
                    "密码"
                  ),
                  h("Input", {
                    props: {
                      value: this.value,
                      autofocus: true,
                      placeholder: this.data6[index].password
                    },
                    on: {
                      input: val => {
                        this.value = val;
                        this.data6[index].password = val;
                      }
                    }
                  })
                ]
              )
            ])
          ]);
        }
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    }
  },
  beforeCreate() {
    console.log("开始");
    // 判断是否登录
    if (localStorage.getItem("Authorization") == null) {
      console.log("请登录");
    }
  },
  created() {
    let params = {};
    let headers = {
      Authorization: localStorage.getItem("Authorization")
    };
    try {
      https
        .fetchGet("/api/users/users", params, headers)
        .then(data => {
          // 验证码结束,不正确
          if (data == "oauthError") {
            this.$router.push({ path: "/login" });
          }
          this.data6 = data.data;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page_list {
  margin-top: 30px;
  text-align: center;
}
</style>
