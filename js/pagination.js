Vue.component('pagination', {
  template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <!-- 第一頁 -->
      <li
        class="page-item"
        :class="{'disabled': pages.current_page === 1}"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="emitPages(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <!-- 1~n頁 -->
      <li
        v-for="(item, index) in pages.total_pages"
        :key="index"
        class="page-item"
        :class="{'active': item === pages.current_page}"
      >
        <a
          class="page-link"
          href="#"
          @click.prevent="emitPages(item)"
        >{{ item }}</a>
      </li>
      <!-- 下一頁 -->
      <li
        class="page-item"
        :class="{'disabled': pages.current_page === pages.total_pages}"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Next"
  
          @click.prevent="emitPages(pages.current_page + 1)" 
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
  data(){
    return{}
  },
  props:{
    //在 getProducts 取得的分頁物件
    pages: {}
  },
  methods:{
    //item為點擊的分頁，如點到第2頁會為2，發出emit-pages事件觸發外層的getProducts
    emitPages(item){
      this.$emit('emit-pages', item);
    }
  }
})


