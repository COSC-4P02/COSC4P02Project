<template>
  <div id="carouselExampleIndicators" class="carousel slide carousel-fade" data-bs-ride="carousel">
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
          <div class="carousel-caption d-block" style="left: 0;right: 0;bottom: 0;" :style="{'background': version == 'brock'? color.brock:color.game}">
            <h5>{{items.title}}</h5>
            <p>{{items.description}}</p >
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
        const path = 'https://api.chatbot-ai.ga/data/brock/news'
        axios(path).then((res) => { this.msg = res.data })
      } else if (this.version === 'game') {
        this.msg.items = [{
          title: 'N22 Pelham road race course takes centre stage during first-ever Canadian Cycling eSports Championships',
          description: 'Ella Myers got a sneak peek at the road cycling course for the Niagara 2022 Canada Summer Games recently.',
          image: 'https://niagara2022games.ca/content/images/news/_ansel_image_cache/30b6c5ef7d64964ebab1e5a710bd9139.jpg',
          link: 'https://niagara2022games.ca/news/article/n22-pelham-road-race-course-takes-centre-stage-during-first-ever-canadian-cycling-esports-championships/'
        }]
      }
    }
  },
  watch: {
    version: {
      immediate: true,
      handler (newValue) {
        if (newValue === 'game') {
          this.msg.items = [{
            title: 'N22 Pelham road race course takes centre stage during first-ever Canadian Cycling eSports Championships',
            description: 'Ella Myers got a sneak peek at the road cycling course for the Niagara 2022 Canada Summer Games recently.',
            image: 'https://niagara2022games.ca/content/images/news/_ansel_image_cache/30b6c5ef7d64964ebab1e5a710bd9139.jpg',
            link: 'https://niagara2022games.ca/news/article/n22-pelham-road-race-course-takes-centre-stage-during-first-ever-canadian-cycling-esports-championships/'
          }, {
            title: 'Trans Canada Trail officially partners with the Niagara 2022 Canada Summer Games',
            description: 'Trans Canada Trail and 2022 Canada Games are proud to engage Canadians in a celebration of Canada, athleticism, and healthy, safe and active communities.',
            image: 'https://niagara2022games.ca/content/images/news/_ansel_image_cache/fc73f034be5368550dcc2e51a9992320.png',
            link: 'https://niagara2022games.ca/news/article/trans-canada-trail-officially-partners-with-the-niagara-2022-canada-summer-games/'
          }, {
            title: '‘Looking for the next Carly’: How Shaw-MacLaren is blazing a path for Canadian soccer officials',
            description: 'Carly Shaw-MacLaren’s recent vacation was anything but one.',
            image: 'https://niagara2022games.ca/content/images/news/_ansel_image_cache/5b08e0ab95516bf2e221f27839162964.jpg',
            link: 'https://niagara2022games.ca/news/article/looking-for-the-next-Carly-how-Shaw-MacLaren-is-blazing-a-path-for-canadian-soccer-officials/'
          }]
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
