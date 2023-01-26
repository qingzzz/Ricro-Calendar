<template>
  <v-app>
      <v-container  class="outer-box">
        <CalendarPage class="calendar"/>
        <ToDo class="todo"/>
      </v-container>      
  </v-app>
</template>

<script>
import CalendarPage from './components/CalendarPage'
import ToDo from './components/ToDo'


export default {
  name: 'App',

  components: {
    CalendarPage,
    ToDo,
  },

  data: () => ({
    //
  }),
}
</script>

<style scoped>
.outer-box {
    margin: 15.5556vh 3.6458vw 15.5556vh 3.802vw;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .todo{
    width: 19.53vw;
    height: 71.9444vh;
    min-width: 200px;
  }
</style>

