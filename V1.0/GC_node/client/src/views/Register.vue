<style scoped>
.login_form {
  width: 30%;
  margin: 5% auto;
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
      <p slot="title">注册</p>
      <img src="../assets/logo.png" />

      <div class="form">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入您的姓名"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入您的邮箱"></Input>
          </FormItem>
          <FormItem label="密码" prop="psw">
            <Input type="password" v-model="formValidate.psw" placeholder="请输入您的密码"></Input>
          </FormItem>
          <FormItem label="确认密码" prop="psw2">
            <Input type="password" v-model="formValidate.psw2" placeholder="请再次输入您的密码"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">注册</Button>
            <Button @click="handleRegister('formValidate')" style="margin-left: 80px">已存在账号</Button>
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
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formValidate.psw2 !== "") {
          this.$refs.formValidate.validateField("psw2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formValidate.psw) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        name: "",
        mail: "",
        psw: "",
        psw2: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
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
            message: "请输入密码",
            trigger: "blur"
          },
          { min: 6, max: 20, message: "请输入6-20位字符", trigger: "blur" },
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        psw2: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur"
          },
          {
            validator: validatePass2,
            trigger: "blur",
            required: true
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
          console.log(this.formValidate);

          let params = {
            name: this.formValidate.name,
            email: this.formValidate.mail,
            password: this.formValidate.psw
          };
          let headers = {
            // "Content-Type": "application/x-www-form-urlencoded"
          };
          this.spinShow = true;
          try {
            https
              .fetchPost("/api/oauthUsers/register", params, headers)
              .then(data => {
                if (data.data.msg == -1) {
                  this.$Message.error("已存在该用户,请登录");
                  this.spinShow = false;
                } else {
                  this.$Message.success("已发到后台审核");
                  setTimeout(() => {
                    this.$router.push({ path: "/login" });
                  }, 1000);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$Message.error("按照要求输入");
        }
      });
    },
    handleRegister(name) {
      this.$router.push({ path: "/login" });
    }
  }
};
</script>
