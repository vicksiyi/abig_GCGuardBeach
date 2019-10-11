<template>
  <div>
    <Table border :loading="loading" :columns="columns1" :data="data1"></Table>
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
  name: "HelloWorld",
  data() {
    return {
      modal_loading: false,
      modal2: false,
      modalIndex2: 0,
      total: 0,
      loading: false,
      selectedI: "管理员",
      columns1: [
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "邮箱",
          key: "email"
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
                "分配权限"
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
      data1: []
    };
  },
  methods: {
    show(index) {
      this.$Modal.confirm({
        okText: "确定",
        title: "选择权限",
        onOk: () => {
          let params = {
            name: this.data1[index].name,
            email: this.data1[index].email,
            password: this.data1[index].password,
            selecte: this.selectedI
          };
          let headers = {
            Authorization: localStorage.getItem("Token")
          };
          try {
            https
              .fetchPost("/api/oauthUsers/addUsers", params, headers)
              .then(data => {
                // 验证码结束,不正确
                if (data == "oauthError") {
                  this.$router.push({ path: "/login" });
                } else {
                  if (data.data.msg == 0) {
                    this.$Message.error("已存在该用户,已删除");
                  } else if (data.data.msg == -1) {
                    this.$Message.error("你没有此权限");
                    return;
                  } else {
                    this.$Message.success("分配权限完毕");
                  }
                  this.data1.splice(index, 1);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } catch (err) {
            console.log(err);
          }
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
                      disabled: true,
                      placeholder: this.data1[index].name
                    },
                    on: {
                      input: val => {
                        this.value = val;
                        this.data1[index].name = val;
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
                      disabled: true,
                      placeholder: this.data1[index].email
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
                        vModel: "model6",
                        value: this.value
                      },
                      style: {
                        width: "200px"
                      },
                      on: {
                        "on-change": val => {
                          this.selectedI = val;
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
        this.data1.splice(index, 1);
        this.$Message.success("成功删除");
      }, 2000);
    }
  },
  created() {
    this.loading = true;
    let params = {};
    let headers = {
      Authorization: localStorage.getItem("Token")
    };
    try {
      https
        .fetchGet("/api/oauthUsers/users", params, headers)
        .then(data => {
          // 验证码结束,不正确
          if (data == "oauthError") {
            this.$router.push({ path: "/login" });
          }
          this.data1 = data.data;
          this.total = data.data.length;
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

<style scoped>
.page_list {
  margin-top: 30px;
  text-align: center;
}
</style>>
