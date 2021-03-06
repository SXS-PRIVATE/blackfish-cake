
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasList: true,//购物车是否有数据
    totalMoney: 0,//总金额
    selectAllStatus: false,//是否全选
    uid: 0, //用户ID
    totalCount: 0,//数量
    carts: [],
    first:true
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '',
    })
    this.getCarts();
    app.flushCartStatus();
  },
  onPullDownRefresh: function () {
    this.getCarts();
  },
  onShow: function () {

    if(this.data.first){
      return
    }
    if (app.globalData.flushCart == true) {
      wx.showLoading({
        title: '',
      })
      this.getCarts();
      app.flushCartStatus();
    }
    if (app.globalData.flushCartNum == true) {
      this.setCartNum()
      app.flushCartNum();
    }
  },
  onReady:function(){
    this.setData({
      first: false
    })
  },
  /**
     * 获取购物车商品
     */
  getCarts: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'manageCart',
      data: {
        command: 'get',
        _ids:[]
      },
      success(res) {
        console.log("购物车列表:", res);
        that.successProcess(res)
      },
      fail(res) {
        console.log("购物车加载失败", res)
        that.failProcess(res)
      },
      complete(res) {
      }
    })
  },
  //加载成功做的相关处理
  successProcess:function(res){
    let that=this
    let result = res.result
    if (result == null || result.data.length <= 0) {
      that.setData({
        hasList: false
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
      return
    }

    that.setData({
      carts: result.data,
      hasList: true
    })
    //设置tabbar数量
    that.setCartNum()
    //计算总价
    that.getTotalPrice()
    //隐藏加载框
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  /**
   * 加载失败做的处理
   */
  failProcess:function(res){
    this.setData({
      hasList: false
    })
    //隐藏加载框
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  setCartNum:function(){
    var num = 0;
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      num = num + carts[i].buyCount
    }
    if(num<=0){
      wx.removeTabBarBadge({
        index: 1,
      })
      return
    }
    wx.setTabBarBadge({
      index: 1,
      text: num + ''
    })
  },
  //设置文本框值
  bindIptCartNum: function (e) {

    const index = e.currentTarget.dataset.index;

    var num = e.detail.value;
    let carts = this.data.carts;
    carts[index].buyCount = num;
    carts[index].totalPrice = (carts[index].singlePrice * num).toFixed(2)
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    //更新购物车数量
    this.updateCount(e.currentTarget.dataset.id, carts[index].buyCount, carts[index].totalPrice);
  },

  /* 点击减号 */
  bindMinus: function (e) {

    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].buyCount;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].buyCount = num;
    carts[index].totalPrice = (carts[index].singlePrice * num).toFixed(2)
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    //更新购物车数量
    this.updateCount(e.currentTarget.dataset.id,carts[index].buyCount, carts[index].totalPrice);
  },

  /* 点击加号 */
  bindPlus: function (e) {

    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].buyCount;
    num = num + 1;
    carts[index].buyCount = num;
    carts[index].totalPrice = (carts[index].singlePrice * num).toFixed(2)
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    this.updateCount(e.currentTarget.dataset.id,carts[index].buyCount, carts[index].totalPrice);
  },
  updateCount: function (id,buycount, totalPrice){

    if(id==null || id==undefined || buycount<=1 || totalPrice<=0){
      return;
    }
    let that = this
    wx.cloud.callFunction({
      name: 'manageCart',
      data: {
        command: 'updateCount',
        _id:id,
        _data: {
          buyCount: buycount,
          totalPrice: totalPrice
        }
      },
      success(res) {
        that.setCartNum()
        console.log("updateCount", res);
        // that.setOrderStatus()
        //获取收获地址
        // that.getOrderAddr()
      },
      fail(res) {
        console.log("更新失败", res)

      },
      complete(res) {


      }
    })
  },
  //删除商品
  bindCartsDel(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要删除吗？',
      confirmColor:'#FF0000',
      success: function (res) {

        if (res.confirm) {
          let _ids=[]
          _ids.push(e.currentTarget.dataset.id)
          that.delCart(_ids)
        }
      }
    })
  },
  delCart: function (_ids) {
    //网络请求删除购物车数据
    wx.showLoading({
      title: '',
    })
    var that = this;
    wx.cloud.callFunction({
      name: 'manageCart',
      data: {
        command: 'del',
        _ids: _ids
      },
      success(res) {
        console.log("删除购物车:", res);
        that.successProcess(res)
      },
      fail(res) {
        console.log("删除失败", res)
        that.failProcess(res)
      },
      complete(res) {
        
      }
    })
  },
  //计算总价
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    let num = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].isSelect) {                   // 判断选中才会计算价格
        total += carts[i].buyCount * carts[i].singlePrice;    // 所有价格加起来
        num += carts[i].buyCount;
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalCount: num,
      totalMoney: total.toFixed(2)
    });
  },

  //绑定单选
  bindCheckbox: function (e) {
    var that = this;
    const idx = e.currentTarget.dataset.index;
    let carts = that.data.carts;
    const isSelect1 = carts[idx].isSelect;
    carts[idx].isSelect = !isSelect1;
  
    that.setData({
      carts: carts,
      selectAllStatus: false
    });
    that.getTotalPrice();
  },


  //绑定多选
  bindSelectAll: function (e) {
    var that = this;
    let selectedAllStatus = that.data.selectAllStatus;
    let carts = that.data.carts;
    selectedAllStatus = !selectedAllStatus;
    for (var i = 0; i < carts.length; i++) {
      carts[i].isSelect = selectedAllStatus;
    }

    that.setData({
      carts: carts,
      selectAllStatus: selectedAllStatus
    });
    that.getTotalPrice();
  },

  //购物车结算
  bindSettlement: function () {
    var that = this;
    
    let carts = that.data.carts;
    let jscart = [];
    let _ids=[];  //结算后删除购物车
    for (var i = 0, j = 0; i < carts.length; i++) {
      if (carts[i].isSelect) {
        jscart[j] = carts[i];
        j++;
        _ids.push(carts[i]._id)
      }
    }
    if (jscart.length <= 0) {
      wx.showToast({
        title: '未选择商品',
        icon: 'success',
      })
      return;
    }

    app.flushCartNum()
    that.delCart(_ids)
    wx.setStorageSync('goods', jscart);//存入缓存
    //转到结算页面
    wx.navigateTo({
      url: '/pages/OrderCreate/OrderCreate',
    });

  },

  cakeDetail:function(e){
    wx.navigateTo({
      url: '/pages/CakeDetail/CakeDetail?cakeid='+e.currentTarget.dataset.cakeid
    })
  }
  
})
