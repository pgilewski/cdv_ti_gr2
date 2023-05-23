module.exports = {
  pattern:
    '^(main|test|stage|prod|(feat|tests|fix|(bug|hot)fix|chore|docs)(/[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*){1,2}|release/[0-9]+(.[0-9]+)*(-(alpha|beta|rc)[0-9]*)?)$',
  errorMsg: '🤨 The branch you’re trying to push doesn’t match the expected convention, please rename it!',
};

// You can test the regexp pattern with this online tool: https://regex101.com/

// Examples:
//
// Matching: main
// Matching: test
// Matching: feat/pdx-123/account_update
// Matching: bugfix/user-list
// Matching: fix/user_list
// Matching: bugfix/123
// Matching: bugfix/123/account-update
// Matching: bugfix/123/account_update
// Matching: bugfix/User_crud/account-update
// Matching: hotfix/User_crud/account_update
// Matching: tests/api
// Matching: tests/123
// Matching: tests/123/hello
// Matching: docs/readme-update
// Matching: release/1.0.1
// Matching: release/1.0.1-beta1
// Matching: release/1.0.1-beta
// Matching: release/1.0.1-rc3
//
// No matching: bugfix/
// No matching: bugfix/-
// No matching: bugfix/_
// No matching: bugfix/-name
// No matching: bugfix/_name
// No matching: bugfix/-/name
// No matching: bugfix/-/-
// No matching: bugfix/-/_
// No matching: release/v1.0.1
