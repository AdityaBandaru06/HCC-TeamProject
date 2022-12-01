<template>
  <v-img id="image" :src="imgUrl" max-width="100%" max-height="100%"/>
</template>

<script>
  export default {
    name: 'Alert',
    data(){
        return{
            imgUrl : "../assets/break-alert.jpeg"
        }
    }
  }
</script>