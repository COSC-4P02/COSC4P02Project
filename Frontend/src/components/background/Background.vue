<template>
  <div id="carouselExampleIndicators" class="carousel slide carousel-fade" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="https://brocku.ca/brock-news/wp-content/uploads/2022/03/WVBCelebrate-1600x901.jpg?x70330" class="d-block w-100 min-vh-60" style="height: 70vh" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h5>{{msg.items[0].title}}</h5>
          <p>{{msg.items[0].description}}</p>
        </div>
      </div>
      <div class="carousel-item">
        <img src="https://brocku.ca/brock-news/wp-content/uploads/2019/11/microphone-stock-pic-for-town-halls-etc.jpg?x70330" class="d-block w-100 min-vh-60" style="height: 70vh" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h5>{{msg.items[1].title}}</h5>
          <p>{{msg.items[1].description}}</p>
        </div>
      </div>
      <div class="carousel-item">
        <img src="https://brocku.ca/brock-news/wp-content/uploads/2022/02/GettyImages-1308314704-1600x900.jpg?x70330" class="d-block w-100 min-vh-60" style="height: 70vh" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h5>{{msg.items[2].title}}</h5>
          <p>{{msg.items[2].description}}</p>
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
  data () {
    return {
      msg: ' '
    }
  },
  methods: {
    getNews () {
      const path = 'https://api.chatbot-ai.ga/data/brock/news'
      axios(path).then((res) => { this.msg = res.data }).catch((error) => { console.error(error) })
    }
  },
  created () {
    this.getNews()
  }
}
</script>

<style scoped>

</style>
