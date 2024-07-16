#!/usr/bin/env zsh
VERSION=$1
[ -z "$VERSION" ] && echo "usage: $0 <version|patch|minor|major>" && exit 1
[ -z "$npm_package_version" ] && echo "error: npm_package_version not set" && exit 1

case $VERSION; in
  patch) VERSION=$(echo $npm_package_version | IFS="." read a m p; echo "$a.$m.$((p+1))");;
  minor) VERSION=$(echo $npm_package_version | IFS="." read a m p; echo "$a.$((m+1)).0");;
  major) VERSION=$(echo $npm_package_version | IFS="." read a m p; echo "$((a+1)).0.0");;
esac

confirm() {
    echo -n "$1'?[yN] "
    read -sk REPLY
    case $REPLY in
        [Yy]) echo $2;;
        [Nn]) exit 1;;
        *) confirm "\n$1" $2;;
    esac
}
confirm "bump version from '$npm_package_version' to '$VERSION'" "new version $VERSION"

yarn workspaces foreach -A version ${VERSION} && \
 git commit -am \"v${VERSION}\" && git tag v${VERSION} && \
 echo "bumped to version '${VERSION}' from '$npm_package_version'" 

confirm "push tags to release a new version" "pushing"
git push origin main --tags
