<template>
<div id="q-app">
  <div class="q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col">
        <q-table

          title="Student List"
          :rows="students"
          :columns="columns"
          row-key="studentId"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          
        >
          <template v-slot:body-cell-actions="props" >
            <q-td :props="props">
              <q-btn dense round flat color="blue" @click="getImage(props.row)" icon="person"></q-btn>
              <q-btn dense round flat color="green" @click="editStudent(props.row)"   icon="edit"></q-btn>
              <q-btn dense round flat color="red" @click="deleteStudent(props.row)" icon="delete"></q-btn>             
            </q-td>          
          </template>
        </q-table>

    <q-dialog v-model="card">
      <q-card class="my-card" style="max-height: 400px; width: 400px">
        <q-img :src="url">   
        </q-img>      
      </q-card>    
    </q-dialog> 
      </div>
    </div>
  </div>

</div>
</template>

<script>

import { api } from 'src/boot/axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'


const columns = [
  {
    name: 'studentId',
    required: true,
    label: 'Student Id',
    align: 'left',
    field: row => row.id,
    format: val => `${val}`,
    sortable: true,
    headerClasses: 'table-row-cus',classes:'table-row-cus',
  },
  { name: 'name', align: 'center', label: 'Name',headerClasses: 'table-row-cus',classes:'table-row-cus', field: 'name', sortable: true },
  { name: 'surname', label: 'Surname',headerClasses: 'table-row-cus',classes:'table-row-cus', field: 'surname' ,sortable: true },
  { name: 'phone', label: 'Phone', headerClasses: 'table-row-cus',classes:'table-row-cus',field: 'phone' },
  { name: 'city', label: 'City',headerClasses: 'table-row-cus',classes:'table-row-cus', field: 'city' },
  { name: 'region', label: 'Region', headerClasses: 'table-row-cus',classes:'table-row-cus',field: 'region' },
  { name: 'district', label: 'District', headerClasses: 'table-row-cus',classes:'table-row-cus',field: 'district' },
  { name: 'description', label: 'Description', headerClasses: 'table-row-cus',classes:'table-row-cus', field: 'description' },
  { name: 'actions', label: 'Actions', field: '',headerClasses: 'table-row-cus',classes:'table-row-cus', align:'center' }

]

    export default{
     
        setup(){
          let url = ref(null)
          let string = ref("")

          let image = ref([])
          const $router = useRouter();
          let card = ref(false);



            onMounted(() => {
                getStudents();
            });

            let students = ref([]) 

            function getStudents(){
                api.get("/students")
                .then(response => {
                    students.value = response.data;
                })
            }
            function editStudent(student){
                $router.push({name: 'update', params: {id: student.id}});
            }
            function getImage(row){
              api.get("/images/"+row.id)
                .then(response => {
                  if (response.status === 200){
                    image.value =response.data;
                    string = "data:image/jpeg;base64,"
                    string = string+image.value
                    url.value = string
                    card.value=true;
                  } else {
                    $q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message: "No image"
                    })
                                    
                }})
            }
            const $q = useQuasar()

            function deleteStudent(row){
                api.delete("/students/" + row.id)
                .then(response => {
                    getStudents();
                    if (response.status === 200){
                      $q.notify({
                      color: 'green-4',
                      textColor: 'white',
                      icon: 'done',
                      message: 'Deleted'
                      })
                    } else {
                      $q.notify({
                      color: 'red-5',
                      textColor: 'white',
                      icon: 'warning',
                      message: response.status
                      })
                    }
                });
            }
            return{
                students,
                getStudents,
                editStudent,
                deleteStudent,
                columns,
                getImage,
                url,
                card,
                string,

                            
                pagination: ref({
                    rowsPerPage: 0
                })
        


            }
        }

    }
</script>
<style>
  .table-row-cus{
    max-width: 150px;
    white-space: pre-wrap!important;
    overflow-wrap: break-word;
    text-align: left;
  }
</style>