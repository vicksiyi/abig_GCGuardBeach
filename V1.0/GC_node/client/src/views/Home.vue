<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #515a6e;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
.img_logo{
  width: 100px;
  padding: 3px;
}
</style>



<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <img class="img_logo" src="../assets/logo.png">
          </div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>联系超级管理员
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>反馈
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
          <Layout>
            <Sider hide-trigger :style="{background: '#fff'}">
              <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
                <Submenu name="1">
                  <template slot="title">
                    <Icon type="ios-navigate"></Icon>管理员数据
                  </template>
                  <MenuItem name="1-1">管理员成员管理</MenuItem>
                  <MenuItem name="1-2">管理员审核管理</MenuItem>
                  <MenuItem name="1-3">管理员信息管理</MenuItem>
                </Submenu>
                <Submenu name="2">
                  <template slot="title">
                    <Icon type="ios-keypad"></Icon>用户管理
                  </template>
                  <MenuItem name="2-1">Option 1</MenuItem>
                  <MenuItem name="2-2">Option 2</MenuItem>
                </Submenu>
                <Submenu name="3">
                  <template slot="title">
                    <Icon type="ios-analytics"></Icon>Item 3
                  </template>
                  <MenuItem name="3-1">Option 1</MenuItem>
                  <MenuItem name="3-2">Option 2</MenuItem>
                </Submenu>
              </Menu>
            </Sider>

            <!-- 正文 -->
            <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
              <ListPageData />
            </Content>
          </Layout>
        </Content>
      </Layout>

      <!-- 尾部 -->
      <Footer class="layout-footer-center">开发者 &copy; GC怪兽 1724264854@qq.com</Footer>
    </Layout>
  </div>
</template>



<script>
import ListPageData from "../components/ListPageData";

export default {
  components: {
    ListPageData
  }
};
</script>
