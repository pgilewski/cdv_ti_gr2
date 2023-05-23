module.exports = function (plop) {
  plop.setGenerator('cloud-stack', {
    description: 'Cloud Stack',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Stack name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'apps/cloud/src/stacks/{{dashCase name}}-stack.ts',
        templateFile: 'plop-templates/cloud/stack.ts.hbs',
      },
      {
        type: 'append',
        path: 'apps/cloud/src/stacks/index.ts',
        template: "export * from './{{dashCase name}}-stack';",
      },
      {
        type: 'add',
        path: 'apps/cloud/src/props/{{dashCase name}}-stack-props.ts',
        templateFile: 'plop-templates/cloud/stack-props.ts.hbs',
      },
      {
        type: 'append',
        path: 'apps/cloud/src/props/index.ts',
        template: "export * from './{{dashCase name}}-stack-props';",
      },
      {
        type: 'add',
        path: 'apps/cloud/src/stacks/__tests__/{{dashCase name}}-stack.test.ts',
        templateFile: 'plop-templates/cloud/stack.test.ts.hbs',
      },
    ],
  });
};
