<style scoped>
.login_form {
  width: 30%;
  margin: 10% auto;
  padding-bottom: 50px;
}
.login_form .form {
  position: relative;
  top: 30px;
}
.login_form img {
  width: 80%;
  margin-left: 20px;
}
.login_form_01 {
  font-size: 30px;
  text-align: center;
  margin-block-end: 30px;
  font-family: "PingFang SC";
}
</style>>
<template>
  <div class="wrap">
    <Card class="login_form">
      <!-- <div class="login_form_01">登录</div> -->
      <p slot="title">登录</p>
      <img src="../assets/logo.png" />

      <div class="form">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="邮箱" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入您的邮箱"></Input>
          </FormItem>

          <FormItem label="密码" prop="psw">
            <Input type="password" v-model="formValidate.psw" placeholder="请输入您的密码"></Input>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">登录</Button>
            <Button @click="handleRegister('formValidate')" style="margin-left: 80px">注册</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import https from "../https";

export default {
  data() {
    return {
      formValidate: {
        mail: "",
        psw: ""
      },
      ruleValidate: {
        mail: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确邮箱",
            trigger: "change" | "blur"
          }
        ],
        psw: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "长度必须大于6",
            trigger: "change" | "blur"
          },
          {
            type: "string",
            whitespace: true,
            message: "包含空白字符",
            trigger: "change" | "blur"
          }
        ]
      },
      spinShow: false
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            email: this.formValidate.mail,
            password: this.formValidate.psw
          };
          let headers = {
            // "Content-Type": "application/x-www-form-urlencoded"
          };
          this.spinShow = true;
          try {
            https
              .fetchPost("/api/admins/login", params, headers)
              .then(data => {
                if (data.data.token == undefined) {
                  if (data.data.msg == 0) {
                    this.$Message.error("用户不存在,请先注册");
                  }
                  if (data.data.msg == -1) {
                    this.$Message.error("密码不正确");
                    this.formValidate.psw = "";
                  }
                  if (data.data.msg == "审核中") {
                    this.$Message.error("审核中，请稍后重试");
                  }
                } else {
                  console.log(data.data.token)
                  localStorage.setItem("Token", data.data.token);
                  this.$Message.success("登录成功");
                  setTimeout(() => {
                    this.$router.push({ path: "/" });
                  }, 1000);
                }
                this.spinShow = false;
              })
              .catch(err => {
                console.log(err);
              });
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$Message.error("请输入正确的邮箱或密码");
        }
      });
    },
    handleRegister(name) {
      this.$router.push({ path: "/register" });
    }
  }
};
</script>
