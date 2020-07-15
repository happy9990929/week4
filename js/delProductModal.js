Vue.component('delProductModal', {
    template: `<div class="modal fade" id="productDelete" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">刪除產品</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    是否刪除 <strong>{{tempProduct.title}}</strong> 商品(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
                        取消
                    </button>
                    <button type="button" class="btn btn-danger" @click="delProduct">
                        確認刪除
                    </button>
                </div>
            </div>
        </div>
    </div>`,
    data(){
        return{

        }
    },
    props: {
      tempProduct: {
          imageUrl: [],
      },
      user: {},
    },
    methods:{
      //刪除商品
      delProduct(){
        const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
        //預設帶入 token
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        //刪除後關閉modal，並向外發出update事件
        axios.delete(url).then(() => {
          $('#delProductModal').modal('hide');
          this.$emit('update');
        });
      }
    },
})