<template>
  <div>
    <input type="text" v-model="mes">
    <button @click="send">发送</button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        mes: '',
        data: null
      }
    },
    mounted () {
    },
    methods: {
      send () {
        this.$socket.emit('add', {a: 5, b: 3})
      }
    },
    socket: {
      disconnect () {
        console.log('Websocket disconnected from ' + this.$socket.nsp)
      },
      senMsg (msg) {
        console.log(msg)
      }
    },
    components: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
