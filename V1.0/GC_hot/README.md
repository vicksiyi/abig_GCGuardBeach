# 🧧 系统构建
- dist包

由于本系统组件库通过Iview来构建，那么此时需要到 [GitHub](https://github.com/TalkingData/iview-weapp) 下载 iView Weapp 的代码，将 dist 目录拷贝到自己的项目中。

然后通过微信开发者工具打开->导入即可

# ✨ 目录结构
- image : 主包资源文件
- page：主包&子包
  - packageA(主包)
	- index : 首页
	- commodity : 兑换
	- interactive : 发现
	- login : 登录
	- logs : 日志
	- mine : 我的
	- news : 新闻
	- test : 测试
  - packageB
    - FullView : 全览
    - knowledge : 海洋知识
    - volunteer : 志愿者活动列表
    - volunteerJoin : 加入志愿活动
  - packageC
    - NewsDetail : 新闻详情
    - VideoDetail : 视频详情
  - packageF
     - find : 发现表单提交
     - FindCircle : 发现圈
     - record : 我的发现圈
   - packageG
      - commoditycar : 兑换车
      - order : 物流
      - ShowDetail : 我的兑换
    - packageH
      - about : 关于我们
      - feedback : 意见反馈
      - myinfo : 我的信息
      - myOrganization : 聊天页面
      - myVolunteer : 我加入的志愿活动
      - rank : 排名
    - packageI
			 - email : 邮箱验证
			 - phone : 电话号码验证
- utils：工具包
    - base64src.js : Buffer解码
    - locations.js : 地图接口封装
    - oauth.js : 获取access_token
    - qqmap-wx-jssdk.js : 腾讯地图SDK
    - requests.js : 获取后台数据接口
    - util.js : 时间格式化&函数节流
    - weatherLogo.js : 天气logo
- style：样式包
    - base
    - widget
    - weui.css
