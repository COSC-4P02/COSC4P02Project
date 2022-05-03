<template>
  <nav class="navbar navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">
        <img :src="botInfo.botIcon" :alt="botInfo.botIcon" width="55" height="35" class="d-inline-block align-text-top">
        {{botInfo.botTitle}}</a>
      <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">{{botInfo.navTitle}}</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <div v-if="!this.GLOBAL.ifAPP" class="nav-link active" aria-current="page" >Web Setting</div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Switch Bot
              </a>
              <ul class="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
                <li><button class="dropdown-item" @click="switchVersion('brock')" >Brock university</button></li>
                <li><a class="dropdown-item"  @click="switchVersion('game')" >Niagara 2020 Summer Game</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="offcanvasNavbarSize" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Font size
              </a>
              <ul class="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
                <li><a class="dropdown-item" @click="fontChange('0')">Small</a></li>
                <li><a class="dropdown-item" @click="fontChange('1')">Middle</a></li>
                <li><a class="dropdown-item" @click="fontChange('2')">Large</a></li>
              </ul>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li class="nav-item">
              <div v-if="!this.GLOBAL.ifAPP" class="nav-link active" aria-current="page" >Useful Links</div>
            </li>
            <li class="nav-item dropdown" v-for="(items) in links.list" :key="items" >
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{items.type}}
              </a>
              <ul class="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
                <li v-for="(item) in items.links" :key="item"><a class="dropdown-item" :href="item.link" target="_blank">{{item.label}}</a></li>
              </ul>
            </li>
            <li><hr class="dropdown-divider"></li>
          </ul>
          <form v-if="!this.GLOBAL.ifAPP" class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Type what you want" aria-label="Search">
            <button class="btn btn-outline-success" type="submit" target="_blank">Search</button>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Nav',
  props: {
    version: {
      type: String,
      default: 'brock'
    },
    switchVersion: {
      type: Function,
      default: () => {}
    },
    fontChange: {
      type: Function,
      default: () => {}
    }

  },
  data () {
    return {
      botInfo: {
        botTitle: '',
        botIcon: '../assets/icons/bubble.svg',
        IconAlt: '',
        navTitle: '',
        OfficialWeb: ''
      },
      links: ''
    }
  },
  methods: {
  },
  watch: {
    version: {
      immediate: true,
      handler (newValue) {
        if (newValue === 'game') {
          this.botInfo.botTitle = 'Canada Summer Games'
          this.botInfo.botIcon = require('../assets/canada_game/n22-logo.webp')
          this.botInfo.IconAlt = 'Niagara 2022 Canada Games logo'
          this.botInfo.navTitle = 'Niagara 2022 Games Bot'
          this.botInfo.OfficialWeb = 'https://niagara2022games.ca/'
          this.links = require('../assets/UsefulLinks/CgamesLink.json')
        } else if (newValue === 'brock') {
          this.botInfo.botTitle = 'Brock University'
          this.botInfo.botIcon = require('../assets/brock/brocku-logo-rgb.png')
          this.botInfo.IconAlt = 'Brock University logo'
          this.botInfo.navTitle = 'Brock Bot'
          this.botInfo.OfficialWeb = 'https://brocku.ca/'
          this.links = require('../assets/UsefulLinks/BrockuLink.json')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
