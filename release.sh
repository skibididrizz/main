#!/usr/bin/env zsh
VERSION=$1
[ -z "$VERSION" ] && echo "usage: $0 <version>" && exit 1

yarn workspaces foreach -A version ${VERSION} && \
git commit -am \"v${VERSION}\" && git tag v${VERSION} && \
echo "bumped to version '${VERSION}' from '$npm_package_version'" && \
echo 'do not forget to \"git push --tags origin main\" to update docs and release new version'