<template>
<v-card class="grey darken-4">
    <v-app id="inspire" >
    <v-container fluid class=" fill-height">
    <v-app-bar
      app
      color="#212121"
      dark
      absolute
      clipped-left
      elevate-on-scroll
    ><v-img
    class="mx-2"
    src="https://cdn2.iconfinder.com/data/icons/self-driving-car-2/64/Driver-alertness-monitoring-fatigue-safety-512.png"
    max-height="40"
    max-width="40"
    contain
  ></v-img>
      <v-app-bar-title class="text-no-wrap">
        DMS
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon >mdi-bluetooth</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-battery-charging</v-icon>
      </v-btn>
       <v-btn icon>
        <v-icon>mdi-network-strength-4</v-icon>
      </v-btn>
      <h2>{{ timestamp }}</h2>
    </v-app-bar>
    <v-navigation-drawer absolute
      v-model="drawer"
      class="grey lighten-4"
      permanent
      app
      clipped
    >
    <v-list nav>
      <v-list-item-group v-model="model" active-class="SelectedTile-active">
        <v-list-item
          class="tile"
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
        > 
          <v-list-item-icon>
            <v-icon size="120" class="ml-6"
            :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>
        <v-divider/>
        </v-list-item>
         </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
       <router-view></router-view>
        </v-container>
    </v-main>
    <div v-if="shouldRender">
    </div>

    </v-container>
   <v-footer padless>
       <v-row
      justify="center"
      no-gutters
      >
      <v-col
        class=" text-center black--text font-weight-bold"
        cols="12"
      >
       Stay Awake and Alert!
      </v-col>
      </v-row>
    </v-footer>
    </v-app>
    </v-card>
</template>

<script>

export default {
  name: 'App',
  props: {
    msg: String,
    alert:String,
  },
  components: {
  },
  data: () => ({
    windowSize: {
      x: 0,
      y: 0
    },
    timestamp: "",
    drawer: true,
    shouldRender : true,
    items: [
          //{ title: 'Home', icon: 'mdi-home', color:'yellow',to:'/'  },
          { title: 'Home', icon:  'mdi-home', color:'yellow' ,to:'/'},
          { title: 'Start Monitoring', icon:  'mdi-video', color:'red' ,to:'/alert'},
          { title: 'Stop Monitoring', icon:  'mdi-video-off', color:'red',to:'/alert-stop'},
          { title: 'Settings', icon: 'mdi-cog-outline', color:'light-blue darken-2',to:'/settings' },
          { title: 'Maps', icon: 'mdi-google-maps', color:'green' },
          { title: 'Phone', icon: 'mdi-phone', color:'blue' }
       ],
      model: 1,

  }),
  created() {
                setInterval(this.getNow, 1000);
  },
  mounted(){
    this.onResize()
  },
  methods: {
            getNow: function() {
                    const today = new Date();
                    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    const dateTime = date +' '+ time;
                    this.timestamp = dateTime;
                },
              onResize () {
                this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    }
    },  
};
</script>
<style scoped>
  .tile {
    margin: 5px;
    border-radius: 4px;
    background: rgb(0, 0, 0);
  }
  .SelectedTile-active{
    background: rgb(163, 185, 185);
  }

</style>