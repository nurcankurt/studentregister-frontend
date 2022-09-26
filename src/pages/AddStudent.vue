<template>
    <q-page class="row justify-center" >
      <q-form ref="myForm"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="student.name"
          label="Name"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"         
        />
  
        <q-input
          filled
          v-model="student.surname"
          label="Surname"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
  
        <q-input
        filled
        v-model="student.phone"
        label="Phone"
        mask="(###) ### - ####"
        hint="Mask: (###) ### - ####"
      />
      <q-select
        filled
        v-model="student.city"
        :options="cityOptions"
        label="City"
        style="width: 250px"
        @update:model-value="val => filterRegion(val)"
      />

      <q-select
        filled
        v-model="student.region"
        :options="selectedCityList"
        label="Region"
        style="width: 250px"
        @update:model-value="val => filterDistrict(val)"
      />

      <q-select
        filled
        v-model="student.district"
        :options="filteredDistrictList"
        label="District"
        style="width: 250px"        
      />
      
      <q-input
      v-model="student.description"
      filled
      autogrow
      label="Description"
    />

    <input type="file" id="file" accept="image/*" />
    

        <!----<q-file filled bottom-slots  v-model="image" counter accept="image/*" 
        max-file-size="2000000" @rejected="onRejected">
        <template v-slot:prepend>
          <q-icon name="attach_file" @click.stop.prevent />
        </template>
        <template v-slot:append>
          <q-icon name="cancel" @click.stop.prevent="image = null" class="cursor-pointer" />
        </template>

        <template v-slot:hint>
          Less than 2 mb
        </template>
      </q-file> -->

        <div>
          <q-btn label="Submit" @click = "validate()" color="primary"/>        
        </div>
      </q-form>
  
    </q-page>
  </template>

<script>
  
import {api} from './../boot/axios';
import { onMounted, ref, computed, defineComponent } from 'vue'
import { useQuasar } from 'quasar'

import states from '../../State.json';
import regions from '../../Region.json';
import districts from '../../District.json';
import { useStore } from 'vuex';



export default defineComponent ( {
  props: ["id"],
  setup (props) {
    const $store = useStore();

      //let image = ref(null)

      let student = ref({
      name:'',
      surname:'',
      phone:'',
      city:'',
      region:'',
      district:'',
      description:''})

      onMounted( async () => {
        if(props.id){
          await api.get("/students/" + props.id)
                .then(response => {
                  console.log(response.data);
                    student.value = response.data;
                });
        }

      })

      let cityOptions = states.map(x=>x.state)
      

      function filterRegion (e) {
          const selectedCityList = regions.filter(x => x.state === e).map(x=>x.name);
          $store.dispatch('region/setRegions', selectedCityList);
      }

      const selectedCityList = computed({
      get: () => $store.getters['region/getRegions']
      });

      function filterDistrict (e) {
          const filteredDistrictList = districts.filter(x => x.region === e).map(x=>x.district);
          $store.dispatch('district/setDistricts', filteredDistrictList);
      }
      const filteredDistrictList = computed({
      get: () => $store.getters['district/getDistricts']
      });
    
      const myForm = ref(null);

      function validate () {
        myForm.value.validate().then(success => {
          if (success) {
           addStudent();
           this.$router.push({ path: '/students'})
          }
          else {
            console.log("invalid")
          }
        })
      }     

   

      function onRejected (rejectedEntries) {
      $q.notify({
        type: 'negative',
        message: `File did not pass validation constraints`
      })
    }


    const $q = useQuasar()

    let formData = new FormData()

    function addStudent(){

      const inputFile = document.getElementById("file");
      formData.append("image", inputFile.files[0]);
      console.log(inputFile)
      /*for (const file of inputFile.files) {
        formData.append("image", file);
     }*/
      const unwrapped = JSON.stringify(student.value)
      formData.append('str',unwrapped)


      if (props.id) {
        student.id=props.id;
        api.put("/students",formData,                
        {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',    
                  "Content-type": "application/json",
                  'Content-Type' : 'image/png'
                }
              })
      .then(response => {
            if (response.status === 200){
              console.log("123");
              $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'done',
              message: 'Updated'
              })
            } else {
              $q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'warning',
              message: response.status
              })
            }
      })
      } else {
            api.post("/students", formData,
                {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',    
                  "Content-type": "application/json",
                  'Content-Type' : 'image/png'
                }
              })
        .then(response => {
            if (response.status === 200){
              $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'done',
              message: 'Added'
              })
            } else {
              $q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'warning',
              message: response.status
              })
            }
      })  
      }  

      
    }

    
    return {
      student,
      addStudent,
      filterRegion,
      filterDistrict,
      validate,
      onRejected,
      //uploadImage,
      formData,
      //image,
      myForm,
      states,
      cityOptions,
      selectedCityList,
      filteredDistrictList
    }
  }
})
</script>