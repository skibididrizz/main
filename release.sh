#!/usr/bin/env zsh
VERSION=$1
[ -z "$VERSION" ] && echo "usage: $0 <version|patch|minor|major>" && exit 1
[ -z "$npm_package_version" ] && echo "error: npm_package_version not set" && exit 1

case $VERSION; in
  patch) VERSION=$(echo $npm_package_version | awk -F. '{print $1"."$2"."$3+1}');;
  minor) VERSION=$(echo $npm_package_version | awk -F. '{print $1"."$2+1".0"}');;
  major) VERSION=$(echo $npm_package_version | awk -F. '{print $1+1".0.0"}');;
esac



yarn workspaces foreach -A version ${VERSION} && \
git commit -am \"v${VERSION}\" && git tag v${VERSION} && \
echo "bumped to version '${VERSION}' from '$npm_package_version'" && \
echo "do not forget to 'git push --tags origin main' to update docs and release new version"