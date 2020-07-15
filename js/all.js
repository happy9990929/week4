
new Vue({
    el: '#app',
    data(){
      return{
        products: [], //AJAX回來的產品資料
        pagination: {}, //AJAX回來的分頁資料
        tempProduct: { //暫存的資料，點擊確認後才會更新，需先定義imageUrl為空陣列，否則確認後會出現錯誤
            imageUrl: [],
        },
        isNew: false, //是否為新增產品
        status: {
          fileUploading: false //是否有更新指定檔案
        },
        user: {
          token: '',
          uuid: '5a9a47b3-910d-4fe0-9fb8-91afdd02ef76'
        },
        APIpath: 'https://course-ec-api.hexschool.io/api/'
      }
    },
    created(){
      //在資料建立後，取得token驗證身分
      this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      //如無token則返回login，防止直接輸入網址就可進入product頁面
      if(this.user.token === ''){
        window.location = 'login.html'
      }
      //執行取得產品資料
      this.getProducts();
    },
    methods: {
      //取得產品資料，page頁碼，預設值為第一頁
      getProducts(page = 1){
        const api = `${this.APIpath}${this.user.uuid}/admin/ec/products?page=${page}`;
        //預設帶入token
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        
        //回傳的結果資料傳入products、pagination
        axios.get(api).then((res)=>{
          this.products = res.data.data; //取得產品列表
          this.pagination = res.data.meta.pagination;  //取得分頁資料
        }).catch((error)=>{
          console.log(error);
        })
      },
      //開啟 Modal 視窗
      openModal(isNew, product) {
        switch (isNew) {
          case 'new':
              //將原本的資料清除
              this.tempProduct = {
                  imageUrl: [],
              };
              //切換為新增狀態
              this.isNew = true;
              //開啟產品modal
              $('#productModal').modal('show');
              break;
          case 'edit':
              // this.tempProduct = Object.assign({}, product);
              // // 使用 refs 觸發子元件方法 取得id
              // this.$refs.productModal.getProducts(this.tempProduct.id);
              this.getProduct(product.id);
              //切換為編輯狀態
              this.isNew = false;
              break;
          case 'delete':
              //目前只有一層物件，可用淺層拷貝
              this.tempProduct = Object.assign({}, product);
              //開啟刪除modal
              $('#productDelete').modal('show');
              break;
          default:
              break;
        }
      }
    }
})