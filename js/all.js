
new Vue({
    el: '#app',
    data(){
      return{
        products: [],
        pagination: {},
        //暫存的資料，點擊確認後才會更新
        tempProduct: {
            imageUrl: [],
        },
        isNew: false, //是否為新增產品
        status: {
          fileUploading: false //是否有更新指定檔案
        },
        user: {
          token: '',
          uuid: '5a9a47b3-910d-4fe0-9fb8-91afdd02ef76'
        }
      }
    },
    created(){
      //在資料建立後，取得token驗證身分
      this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      //如無token則返回login，防止直接輸入網址就可進入product頁面
      if(this.user.token === ''){
        window.location = 'login.html'
      }
      this.getProducts();
    },
    methods: {
      //取得產品資料
      getProducts(page = 1){
        const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/products?page=${page}`;
        //預設帶入token
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        
        //回傳的結果資料傳入products、pagination
        axios.get(api).then((res)=>{
          this.products = res.data.data;
          this.pagination = res.data.meta.pagination;
        }).catch((error)=>{
          console.log(error);
        })
      },
      openModal(isNew, product) {
        switch (isNew) {
          case 'new':
              this.tempProduct = {
                  imageUrl: [],
              };
              this.isNew = true;
              $('#productModal').modal('show');
              break;
          case 'edit':
              this.tempProduct = Object.assign({}, product);
              // 使用 refs 觸發子元件方法 取得id
              this.$refs.productModal.getProducts(this.tempProduct.id);
              this.isNew = false;
              break;
          case 'delete':
              this.tempProduct = Object.assign({}, product);
              $('#productDelete').modal('show');
              break;
          default:
              break;
        }
      }
    }
})