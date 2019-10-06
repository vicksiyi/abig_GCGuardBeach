<template>
  <div>
    <Table :loading="loading" border :columns="columns7" :data="data6"></Table>
    <div class="page_list">
      <Page :total="total" show-elevator />
    </div>
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除</span>
      </p>
      <div style="text-align:center">
        <p>删除该管理员之后,将不可再通过此账号密码登录</p>
        <p>确定删除?</p>
      </div>
      <div slot="footer">
        <Button
          type="error"
          size="large"
          long
          :loading="modal_loading"
          @click="del(modalIndex2)"
        >确定删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import https from "../https";

export default {
  name: "ListPageData",
  props: {},
  data() {
    return {
      modal_loading: false,
      modal2: false,
      modalIndex2: 0,
      total: 0,
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
        title: "修改",
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
                      on: {
                        select: val => {
                          console.log(val, "ok");
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
                      placeholder: this.data6[index].password,
                      disabled:
                        this.data6[index].password == "你没此权限"
                          ? true
                          : false
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
      this.modal2 = true;
      this.modalIndex2 = index;
    },
    del(index) {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modal2 = false;
        this.data6.splice(index, 1);
        this.$Message.success("Successfully delete");
      }, 2000);
    }
  },
  beforeCreate() {
    console.log("开始");
    // 判断是否登录
    if (localStorage.getItem("Token") == null) {
      this.$Message.error("请先登录!");
      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 1000);
    }
  },
  created() {
    let params = {};
    let headers = {
      Authorization: localStorage.getItem("Token")
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
          this.total = data.data.length;
          console.log(this.total);
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
