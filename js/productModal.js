Vue.component('productModal', {
    template: `<div class="modal fade" id="productModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title">新增產品</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                          <div v-for="i in 5" :key="i + 'img'" class="form-group">
                            <label :for="'img' + i">輸入圖片網址</label>
                            <input :id="'img' + i" v-model="tempProduct.imageUrl[i - 1]" type="text" class="form-control"
                              placeholder="請輸入圖片連結">
                          </div>
                          <div class="form-group">
                            <label for="customFile">
                              或 上傳圖片
                              <i v-if="status.fileUploading" class="fas fa-spinner fa-spin"></i>
                            </label>
                            <input id="customFile" ref="file" type="file" class="form-control" @change="uploadFile">
                          </div>
                          <img class="img-fluid" :src="tempProduct.imageUrl[0]" alt />
                        </div>
                        <div class="col-sm-8">
                            <div class="form-group">
                                <label for="title">標題</label>
                                <input v-model="tempProduct.title" type="text" class="form-control" id="title" placeholder="請輸入標題">
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="category">分類</label>
                                    <input v-model="tempProduct.category" type="text" class="form-control" id="category" placeholder="請輸入分類">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="unit">單位</label>
                                    <input v-model="tempProduct.unit" type="text" class="form-control" id="unit" placeholder="請輸入單位">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="origin_price">原價</label>
                                    <input v-model="tempProduct.origin_price" type="number" class="form-control" id="origin_price" placeholder="請輸入原價">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="price">售價</label>
                                    <input v-model="tempProduct.price" type="number" class="form-control" id="price" placeholder="請輸入售價">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="description">產品描述</label>
                                <textarea v-model="tempProduct.description" type="text" class="form-control" id="description" placeholder="請輸入產品描述"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="content">說明內容</label>
                                <textarea v-model="tempProduct.content" type="text" class="form-control" id="content" placeholder="請輸入說明內容"></textarea>
                            </div>
                            <div class="form-check">
                                <input v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox" id="is_enabled">
                                <label class="form-check-label" for="is_enabled">
                                    是否啟用
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-warning" @click="updateProduct">確認</button>
                </div>
            </div>
        </div>
    </div>`,
    data(){
      return{
        //暫存的資料，點擊確認後才會更新
        tempProduct: {
            imageUrl: [],
        },
        APIpath: 'https://course-ec-api.hexschool.io/api/'
      }
    },
    props:{
      productid: '',
      status: '',
      isNew: true,
      user: {}
    },
    methods: {
      //取得id 取出第幾筆資料
      getProduct(id){
        //api為第幾筆id
        const api = `${this.APIpath}${this.user.uuid}/admin/ec/product/${id}`;
        //取出AJAX
        axios.get(api).then((res)=>{
          //開啟modal
          $('#productModal').modal('show');
          //取出的產品資料傳入tempProduct
          this.tempProduct = res.data.data;
        }).catch((error)=>{
          console.log(error);
        })
      },
      //上傳產品資料
      updateProduct() {
        //新增商品，http為post新增
        let api = `${this.APIpath}${this.user.uuid}/admin/ec/product`;
        let httpMethod = 'post';
        //當不是新增商品時，切換為編輯產品API
        if(!this.isNew){
          api = `${this.APIpath}${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
          httpMethod = 'patch';
        }
        //預設帶入 token 需經過token驗證才能上傳
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        //帶入http動作、api來新增或更新
        axios[httpMethod](api, this.tempProduct).then(()=>{
          //新增或更新完成後關閉modal
          $('#productModal').modal('hide');
          //向外層發出一個update事件
          this.$emit('update'); 
        }).catch((error)=>{
          console.log(error);
        })  
      },
      //上傳檔案
      uploadFile(){
        //第一筆資料
        const uploadedFile = this.$refs.file.files[0]; 
        //轉成FormData
        const formData = new FormData();
        //新增file欄位，formData裡放入剛抓出的第一筆資料uploadedFile
        formData.append('file', uploadedFile);
        const url = `${this.APIpath}${this.user.uuid}/admin/storage`;
        //開啟更新檔案狀態
        this.status.fileUploading = true;
        //使用FormData格式，才能給後端做正確的判斷
        axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res)=>{
          //關閉更新檔案狀態
          this.status.fileUploading = false;
          //如狀態成功，將圖片存至結果
          if(res.status === 200){
            this.tempProduct.imageUrl.push(res.data.data.path);
          }
        }).catch(()=>{
          console.log('上傳不可超過2MB');
          //關閉更新檔案狀態
          this.status.fileUploading = false;
        })
      },

    }
})