module.exports = {
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        // ========== '@angular-eslint' plugin ==========
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'ngx',
            style: 'kebab-case'
          }
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'ngx',
            style: 'camelCase'
          }
        ]
      }
    }
  ]
};
