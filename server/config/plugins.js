module.exports = ( { env } ) => ({
    'duplicate-button': true,
    'color-picker': true,
    'import-export-entries': {
      enabled: true,
    },
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    },
  });