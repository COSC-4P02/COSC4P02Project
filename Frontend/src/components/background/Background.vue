<template>
  <div v-if="!this.GLOBAL.ifAPP" id="carouselExampleIndicators" class="carousel slide carousel-fade" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button v-for="(items, index) in msg.items" :key="items"
              type="button" data-bs-target="#carouselExampleIndicators"
              v-bind:data-bs-slide-to="index" :class="{'active':index==0}"
              v-bind:aria-current="{'true':index==0}" v-bind:aria-label="'Slide '+(index+1)">
      </button>
    </div>
    <div class="carousel-inner">
      <div v-for="(items,index) in msg.items" v-bind:key="items" class="carousel-item ratio ratio-16x9" :class="{'active':index==0}" >
        <a :href="items.link"><img :src="items.image" class="d-block w-100" style="object-fit: cover" alt='...'></a>
        <div>
          <div class="carousel-caption d-block" style="height: 20vh; left: 0;right: 0;bottom: 0;" :style="{'background': version == 'brock'? color.brock:color.game}">
            <h5>{{items.title}}</h5>
            <p style="text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2">{{items.description}}</p >
          </div>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Background',
  props: {
    version: {
      type: String,
      default: 'brock'
    }
  },
  data () {
    return {
      msg: ' ',
      color: {
        brock: 'linear-gradient(0deg, rgba(204,0,0,1) 70%, rgba(204,0,0,0.005) 100%)',
        game: 'linear-gradient(0deg, rgba(0,79,113,1) 70%, rgba(0,79,113,0.018644957983193322) 100%)'
      }
    }
  },
  methods: {
    getNews () {
      if (this.version === 'brock') {
        this.msg.items = [{
          title: '',
          description: '',
          image: '../assets/brock/Brock.jpg',
          link: ''
        }]
      } else if (this.version === 'game') {
        this.msg.items = [{
          title: '',
          description: '',
          image: 'https://niagara2022games.ca/content/images/news/_ansel_image_cache/30b6c5ef7d64964ebab1e5a710bd9139.jpg',
          link: ''
        }]
      }
    }
  },
  watch: {
    version: {
      immediate: true,
      handler (newValue) {
        if (newValue === 'game') {
          const path = 'https://api.chatbot-ai.ga/data/game/news'
          axios(path).then((res) => { this.msg = res.data })
        } else if (newValue === 'brock') {
          const path = 'https://api.chatbot-ai.ga/data/brock/news'
          axios(path).then((res) => { this.msg = res.data })
        }
      }
    }
  },
  created () {
    this.getNews()
  }
}
</script>

<style scoped>

</style>
