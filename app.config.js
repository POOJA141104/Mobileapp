module.exports = ({ config }) => {
  const isDeploy =
    process.env.npm_lifecycle_event === 'predeploy' ||
    process.env.BUILD_FOR_GH_PAGES === 'true';

  return {
    ...config,
    name: 'FreshMart Grocery',
    slug: 'Mobileapp',
    experiments: {
      ...config.experiments,
      ...(isDeploy ? { baseUrl: '/Mobileapp' } : {}),
    },
  };
};

