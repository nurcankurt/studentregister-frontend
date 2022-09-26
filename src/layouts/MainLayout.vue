<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title >
          Student Register
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs v-model="tab" align= "left">
        <q-route-tab to="/" icon = "home" name="home" key="home"  /> 
        <q-route-tab to="/students" name="list" label="List" key="list"/>
        <q-route-tab to="/add" name="add" label="Add" key="add" />
        <q-route-tab to="/add/:id" label="update" name="update" key="update" @click="navCancel"/>
        
      </q-tabs>
    </q-header>

    <q-page-container>
        <q-page>
          <router-view />
          <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_up" color="accent" />
          </q-page-scroller>
        </q-page>
      </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Student Register</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      tab: 'home'
    }
  },
  watch:{
    tab(val) {
      var vm = this;
      setTimeout(function(){
        if(window.location.href.indexOf("add/")>0){
        vm.tab="update";
      }
      },1)
      
      console.log(val)
    }
  },
  mounted(){
    console.log(this.tab);
  },
  methods: {
    navCancel(e){
      e.preventDefault();

    }
    
  }
}

</script>