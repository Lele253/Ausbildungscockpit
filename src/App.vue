<template>
  <v-app>
    <v-main style="position: fixed">
      <div class="hero img"/>
      <router-view class="divOverBackground"/>
    </v-main>
  </v-app>
</template>


<style>
/*@import url("https://fonts.googleapis.com/css?family=Montserrat:700");*/

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.hero {
  width: 100%;
  height: 100%;
  background-image: url('./assets/background.jpeg');
  font-family: "Montserrat", sans-serif;
}

.img {
  position: fixed;
  background-image: url('./assets/background.jpeg');
  filter: brightness(80%) blur(2px);
  background-size: cover;
  height: 100vh;
  width: 100vw;
  z-index: 0;
}

.divOverBackground {
  position: fixed;
  top: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88vh;
  width: 100vw;
  background-color: transparent;
  z-index: 100;
}

</style>
