Contributing to the Moonpot App
=======

<div style="text-align: center; padding: 24px 0px;">
    <img src="public/images/ziggy/maintenance.svg" width="300" />
</div>

Hey! Thanks so much for taking the time out to contribute with Moonpot. We really appreciate and value your contribution. Please take 5 minutes to review the items listed below. This will help us merge your contribution as soon as possible.

## Table of contents

- [How to contribute](#how-to-contribute)
- [Joining the community](#joining-the-community)

## How to contribute

### Creating pull requests (PRs)

As a contributor, you are expected to fork this repository, work on your own fork and then submit pull requests. The pull requests will be reviewed and eventually merged into the master repo. See ["Fork-a-Repo"](https://help.github.com/articles/fork-a-repo/) for how this works.

### A typical workflow

1. Make sure your fork is up to date with the master repository (on the `dev` branch):

``` bash
cd moonpot-app
git remote add upstream https://github.com/moonpotdev/moonpot-app.git
git fetch upstream
git pull --rebase upstream dev
```
NOTE: The directory `moonpot-app` represents your fork's local copy.

We use the `main` branch for pushing code live into production. We use the default `dev` branch for all PRs and contributions, before maintainers make these updates live into the `main`. This allows us to run tests and view the front end changes before hitting actual Moonpot users.

2. Branch out from `dev` into `fix/some-bug#123`:
(Postfixing #123 will associate your PR with the issue #123 and make everyone's life easier!)

``` bash
git checkout -b fix/some-bug#123
```

3. Make your changes, add your files, commit, and push to your fork. Bonus marks for using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). Conventional Commits makes your intentions really clear, but at this time, are optional.

``` bash
git add SomeFile.js
git commit "fix: fix some bug #123"
git push origin fix/some-bug#123
```

4. Go to [github.com/moonpotdev/moonpot-app](https://github.com/moonpotdev/moonpot-app) in your web browser and issue a new pull request.

5. Maintainers will review your code and possibly ask for changes before your code is pulled in to the master repository. We'll check that all tests pass, review the coding style, and check for general code correctness. If everything is OK, we'll merge your pull request and your code will be part of Moonpot's App.

*IMPORTANT* Please pay attention to the maintainer's feedback, since its a necessary step to keep up with the standards Moonpot attains to.

Thanks for your time reading this, thanks for your contributions and looking forward to working with you!
