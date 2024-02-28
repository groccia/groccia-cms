export default [
  {
    method: 'POST',
    path: '/create-medusa-user',
    handler: 'medusaController.createUser',
  },
  {
    method: 'POST',
    path: '/synchronise-medusa-tables',
    handler: 'medusaController.syncTables',
  },
];
