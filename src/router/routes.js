
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'home', component: () => import('pages/IndexPage.vue') },
      { path: 'add',name:'add', component: () => import('pages/AddStudent.vue') },
      { path: 'add/:id', name:'update', props:true, component: () => import('pages/AddStudent.vue') },
      { path: 'students', name:'list', component: () => import('pages/StudentList.vue') },
      { path: 'students/:id', component: () => import('pages/EditStudent.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
