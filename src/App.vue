<template>
<v-card>
    <v-app id="inspire">
    <v-app-bar
      app
      color="#3D5AFE"
      dark
      src="https://picsum.photos/1920/1080?random"
      absolute
      clipped-left
    >
      <v-app-bar-title class="text-no-wrap">DMS</v-app-bar-title>

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
      class="grey"
      permanent
      app
      clipped
    >
    <v-list nav>
      <v-list-item-group v-model="model">
        <v-list-item
          class="tile"
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
          @click="menuActionClick(item.title)"
        > 
        <div class="pa-4 text-center secondary text-no-wrap rounded-xl">
          <v-list-item-icon>
            <v-icon size="100" class="ml-6"
            :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>
        </div>
        </v-list-item>
         </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
       <router-view></router-view>
    </v-main>
   <v-footer padless>
       <v-row
      justify="center"
      no-gutters
      >
      <v-col
        class=" text-center white--text font-weight-bold"
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
import SocketioService from './services/socketio.service.js';
export default {
  name: 'App',

  components: {
  },
  data: () => ({
    timestamp: "",
    drawer: true,
    items: [
          { title: 'Home', icon: 'mdi-home', color:'yellow',to:'/'  },
          { title: 'Start Monitoring', icon:  'mdi-video', color:'red' ,to:'/alert' },
          { title: 'Settings', icon: 'mdi-cog-outline', color:'light-blue darken-2',to:'/settings' },
          { title: 'Maps', icon: 'mdi-google-maps', color:'green' },
          { title: 'Phone', icon: 'mdi-phone', color:'blue' }
       ],
    model: 1,
  }),
  created() {
                setInterval(this.getNow, 1000);
  },
  methods: {
            getNow: function() {
                    const today = new Date();
                    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    const dateTime = date +' '+ time;
                    this.timestamp = dateTime;
                },
            menuActionClick(action) {
            if (action === "Start Monitoring") {
                this.monitoring_icon='mdi-maps'
                console.log(action)
                SocketioService.setupSocketConnection();
                SocketioService.socket.emit('start-monitoring', {alert:'dashboard_message'});
                SocketioService.socket.on('message', (message) => {
                  console.log('message:',message)
                  this.$router.push('/alert')
                });
             } 
      }  
     },
      beforeUnmount() {
       SocketioService.disconnect();
    }

};
</script>
<style scoped>
  .tile {
    margin: 5px;
    border-radius: 4px;
  }
  .tile:hover {
    background: green;
  }
  .tile:active {
    background: yellow;
  }
</style>