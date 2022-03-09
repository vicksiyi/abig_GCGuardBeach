 ## :black_nib: 项目简介:pencil2:
 为用户提供一个具有趣味性和公益性的平台。用户可以在小程序上传自己发现的海滩垃圾照
片。志愿者可以通过这款小程序聚集起来，进而更好地为重建蓝色海洋作一份贡献
	
## :whale: 1、技术栈
- 前端：微信小程序原生代码、IviewUI组件库
- 后端：Node、Express、云开发
- 通信：WebSocket
- 数据库：MongoDb

## :frog: 2、系统模块
- 登录授权模块
- 新闻列表模块
- 海洋知识模块
- 生活圈模块
- 发现圈模块
- 商品兑换模块
- 我的模块

## ✨ 3、系统设计
<img width="48%" src="https://user-images.githubusercontent.com/39822906/157384087-64ba0b1d-76dd-4548-a5be-0aa747099abf.png" />	
<img width="48%"  src="https://user-images.githubusercontent.com/39822906/157384124-549e7de4-a379-4501-b057-767d9fb4f867.png" />	
<img width="48%"  src="https://user-images.githubusercontent.com/39822906/157384399-81e7a588-01f8-4251-b063-03c7feceeb1c.png" />
<img width="48%"  src="https://user-images.githubusercontent.com/39822906/157384526-b1f5c812-4b91-4ae3-a0f6-d661ab1e7e91.png" />
<img width="48%"  src="https://user-images.githubusercontent.com/39822906/157384539-e48d1413-3574-485c-a8a2-95930957371f.png" />

## 💯 4、系统原型
<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157384685-713aae77-6193-4163-b5c8-1b3ed806d114.png" />

## 🐯 5、系统截图
- 首页模块

通过二维码等途径关注小程序，已授权登录的用户可直接进入如图 5.1 首页页面。该页面的地图会向用户展示邻近海滩，点击地图上的图标（红色代表发现圈中后台审核通过的受污染地，后文有解释发现圈）可导航到该海滩，且把所在位置显示在文本框。此外该页面可进入发现页面、志愿者页面、冷知识页面。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157384876-3525e18f-6001-44b5-80e0-317020160b8e.png" />

- 发现冷知识模块

如图 5.2 为发现页面，用户可在该页面通过文字加图片的形式提交自己发现的周遭环境的受污染情况或文明清理垃圾等行为，等待后台审核。若通过审核则
可获得一定数量的“爱心”奖励。如图 5.3 为冷知识页面，用户可在该页面了解到海洋的冷知识，该页面每次
进入都会有不同的内容，内容会定时更新。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385003-6d3f7bf8-fbcc-4dd9-b0a5-ab1dcbfb64fb.png" />

- 志愿者模块

如图 5.4 为志愿者页面，里面会排列志愿者活动，用户可在搜索框按关键字搜索带有关键字的志愿者活动。点击活动可进入相应志愿者活动详情页

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385022-d29eb29b-4e5f-4f8d-9324-3089408477f5.png" />

- 志愿活动模块

如图 5.5所示。在志愿活动详情页中，点击生成图可生成相应的活动邀请图保存到用户手机相册中，点击该页面的地图可导航至志愿活动目的地，志愿者名片将显示已加入的志愿的的头像以及加入日期。左下角将显示已加入的志愿者数目，若数目等于最大人数时，该志愿活动人数将不会增加，用户不能加入活动。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385052-12dabd93-7ac5-4340-8669-9ebd054a06a1.png" />

- 发现圈模块

如下图 5.6 为圈子页面，用户可根据喜好筛选自己社区显示的信息的类别，点击选择进入发现圈或是日常生活圈。用户可在这两个圈内进行发布文字或图片、评论、点赞等活动，管理员通过审核用户发布的内容、评论互动活跃，点赞数较多相应的奖励一定数量的“爱心”。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385098-4146c9bf-6b21-4165-aa38-a2554f80fb9c.png" />

如图 5.7 所示为发现圈，用户在发布的发现经后台审核后会显示在该页面，该页面的地图可点击进行导航到目的地。点击分享可生成图片保存至相册分享给好友。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385108-4b9071dd-b569-4c61-b958-c17b84898814.png" />

- 生活圈模块

如图 5.8 所示为生活圈，用户点击黄色图标可进行发圈。图 5.9 为编写生活圈页面。该页面除了文字和图片以外，还可以选择标签进行内容发布。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385121-32559627-bef1-4a18-91d6-ecfb2b872669.png" />

如图 5.10 所示为标签选择页。用户可以在此页面选择发布生活圈所要用到的标签。如图 5.11 为标签详情页。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385140-225f91e1-bff4-4141-9830-0cc5becc068a.png" />

- 兑换模块

如图所示 5.12-5.16 的页面均为兑换的功能页面。用户在如图 5.12 兑换中挑选想要兑换的物品，点击进入选中物品的详情页如图 5.13。将物品加入兑换车，在 5.14 兑换车页面中可进行兑换物品的选中和数量的增减。提交兑换后，兑换订单将分成四种状态，在该页面中点击物流可进行物流信息的查看。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385166-a70a37d8-dc38-4072-8287-b06c66aa4427.png" />
<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385187-a0319b06-65e9-4040-bc03-be1986e02c91.png" />

- 新闻模块

在此页面下面会进行新闻的实时推送，给予用户不一样的功能体验。如图5.17 为新闻页面。新闻类别分为视频、图文，图文又分为推荐、热点、搞笑。推荐下面又有小分类：社会、财经、美食、科普、艺术。在新闻功能的实现中用到了 wxParse 将 html 格式的内容解析显示在小程序中，如图 5.18 新闻详情页所示。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385207-3e580b06-26bf-48fa-8bdc-ef0611fcafe6.png" />

- 我的模块

此如图 5.19 主要是用户操作。如图 5.20 用户信息：填写用户电话和常用地址，用于兑换物品的寄送，更改邮箱信息必须进行邮箱验证。我的社区记录：此页面会将用户在发现圈和日常生活圈发布的内容记录下来，方便用户自己查看。意见反馈：此处用户可提出使用该小程序后遇到的问题以及功能建议。关于我们：写有一些关于我们开发团队的话，以及联系方式。我的组织：用户可在该页面查看加入的志愿者活动，点击活动进入相应的群聊进行即时聊天，如图 5.21 用户可在聊天页面发布表情包，查看历史聊天记录等。如图 5.22 这里运用 webSocket心跳检测，即在服务器重启时会自动进行重新连接，给予用户更好的体验。如图5.23 再次进入房间表示重连成功。

<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385231-998d0676-947e-42c3-b913-d7725f4a0bd5.png" />
<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157385253-cb7a92b6-bfad-48ce-ac88-90d882c26628.png" />


## ⛷️ 6、系统展望
我们团队的初衷就是为了改善海洋环境，为了实现这一想法。我们的项目一共分为两期：第一期为 GC 海滩卫士，目的是为了减少海滩垃圾，不让海洋环境继续恶化。第二期为 GC 海洋博士，既然致力于改善海洋环境，海洋上的垃圾不能熟视无睹。GC 海洋博士与 GC 海滩卫士相比，会深入地研究海洋洋流、海洋环流和流体运动、海洋沉积动力、海气相互作用以及海面上极端天气的提前预警及防护措施。通过开展对以上问题的研究，我们团队将会设计开发出一款定位浮标，当发现海洋的大片垃圾后可通过定位浮标的实时定位，相关的海洋环境保护组织能够准确定位到垃圾的位置信息并开展打捞工作。通过对于海面极端天气的提前预警可以为出海开展打捞工作的工作人员提供一份安全保障。通过 GC 海滩卫士到 GC 海洋博士，聚集社会上支持海洋环境保护公益事业的力量，相信我们的大海会越来越蓝！
<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157387536-28cc1fc7-3bf4-484d-a9d4-c5ada2983a6a.png" />
<img width="90%" align="middle"  src="https://user-images.githubusercontent.com/39822906/157387555-759537dc-fadf-4ac7-9a57-5790db74c8e2.png" />



