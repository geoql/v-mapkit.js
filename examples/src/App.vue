<template>
  <main v-if="jwt">
    <v-map :access-token="jwt" />
  </main>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, Ref } from 'vue';

  export default defineComponent({
    name: 'App',
    setup() {
      let jwt: Ref<string> = ref('');
      onMounted(async () => {
        const tokenUrl = 'https://api.npoint.io/62595698b9853745e634';
        const { token } = await fetch(tokenUrl).then((res) => res.json());
        jwt.value = token;
      });
      return {
        jwt,
      };
    },
  });
</script>

<style>
  body {
    margin: 0;
  }
  #app {
    height: 100vh;
    width: 100vw;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
