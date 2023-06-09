module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/featured-stories',
     handler: 'featured-stories.random',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
