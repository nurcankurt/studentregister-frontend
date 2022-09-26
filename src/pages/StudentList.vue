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
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn dense round flat color="green" @click="editStudent(props.row)"   icon="edit"></q-btn>
              <q-btn dense round flat color="red" @click="deleteStudent(props.row)" icon="delete"></q-btn>
            </q-td>          
          </template>
        </q-table>
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
    sortable: true
  },
  { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
  { name: 'surname', label: 'Surname', field: 'surname' ,sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone' },
  { name: 'city', label: 'City', field: 'city' },
  { name: 'region', label: 'Region', field: 'region' },
  { name: 'district', label: 'District', field: 'district' },
  { name: 'image', label: 'Image', field: 'image' },
  { name: 'description', label: 'Description', field: 'description' },
  { name: 'actions', label: 'Actions', field: '', align:'center' }
]

    export default{
     
        setup(){

            const $router = useRouter();

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

                            
                pagination: ref({
                    rowsPerPage: 0
                })
        


            }
        }

    }
</script>