<template>
 <v-card height="100%" width="100%" outlined color="transparent"> 
  <v-row >
    <v-col cols="2" >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
          @click="menuActionClick(item.title)"
        >

         <div class="pa-4 blue-grey lighten-3 rounded-xl mb-4 pd-2">
          <v-list-item-icon>
            <v-icon size="80" class="align-center"
            :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>
        </div>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="11">
    <v-card
      class="mx-auto"
      max-width="100%"
       max-height="100%"
    >
    <v-overlay
      :z-index="zIndex"
    >
      <v-img id="image" :src="imgUrl" max-width="100%" max-height="100%">
      </v-img>
        </v-overlay>
       </v-card>
    </v-col>
  </v-row>
  </v-card>
</template>

<script>

import SocketioService from '../services/socketio.service.js';
//import VueSocketIO from 'vue-socket.io';
  export default {
    name: 'HelloWorld',
    imgUrl: "",
    data () {
      return {
        zIndex: 0,
        drawer: false,
        overlay: false,
        imgUrl:'',
        items: [
          { title: 'Start Monitoring', icon: 'mdi-video', color:'red' },
          { title: 'Settings', icon: 'mdi-cog-outline', color:'light-blue darken-2',to:'/settings' }
        ],
      }
    },
    methods: {
      menuActionClick(action) {
        if (action === "Start Monitoring") {
            console.log(action)
            SocketioService.setupSocketConnection();
            SocketioService.socket.emit('start-monitoring', {alert:'dashboard_message'});
            SocketioService.socket.on('message', (message) => {
              console.log('message:',message)
              this.imgUrl = "../assets/break-alert.jpeg"
            });

        } 
      }  
    },

  beforeUnmount() {
       SocketioService.disconnect();
    }
  }
  
</script>
