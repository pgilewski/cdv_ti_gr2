module.exports = {
  '{**/*,*}.{js,ts,jsx,tsx}': ['eslint --fix', 'prettier --write'],
  '{**/*,*}.{json,md,mdx,html,css,scss}': ['prettier --write'],
};
