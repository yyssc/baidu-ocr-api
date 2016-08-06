#!/bin/bash

if [ "$TRAVIS_REPO_SLUG" == "yyssc/tims-ocr-api" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then

  echo -e "Publishing jsdoc...\n"

  cp -R "out/tims-ocr-api/3.0.0" $HOME/jsdoc-latest

  cd $HOME
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "travis-ci"
  git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/yyssc/tims-ocr-api gh-pages > /dev/null

  cd gh-pages
  git rm -rf ./jsdoc
  cp -Rf $HOME/jsdoc-latest ./jsdoc
  git add -f .
  git commit -m "Latest jsdoc on successful travis build $TRAVIS_BUILD_NUMBER auto-pushed to gh-pages"
  git push -fq origin gh-pages > /dev/null

  echo -e "Published jsdoc to gh-pages.\n"
  
fi
