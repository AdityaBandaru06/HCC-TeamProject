<template>
 <v-card height="100%" width="100%" outlined color="transparent"> 
  <v-img contain
          :src="goodImgUrl"
          max-height="100%"
          max-width="100%"
  ></v-img>
  </v-card>
</template>

<script>

//import VueSocketIO from 'vue-socket.io';
  export default {
    name: 'HelloWorld',
    data () {
      return {
        goodImgUrl:'https://st4.depositphotos.com/1008010/23468/i/450/depositphotos_234684752-stock-photo-empty-road-yellow-traffic-sign.jpg',
    }
  }
} 
</script>
