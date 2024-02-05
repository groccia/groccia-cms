export default [
  {
    method: 'POST',
    path: '/medusa-user',
    handler: 'medusaController.createUser',
  },
  {
    method: 'POST',
    path: '/sync-tables',
    handler: 'medusaController.syncTables',
  },
];
