#!/bin/bash

# Usage: ./scripts/check_version_and_create_tag.sh 1.0.0
# If the script does not have execute permissions, run `chmod +x ./scripts/check_version_and_create_tag.sh` to grant it.

# Get argument
tag_version=$1

# Extract version information from package.json and manifest.json
package_version=$(node -p "require('./package.json').version")
manifest_version=$(node -p "require('./dist/manifest.json').version")

# Confirm that the versions match
if [ "$tag_version" != "$package_version" ] || [ "$tag_version" != "$manifest_version" ]; then
  echo "Error: version mismatch. Ensure that the version in package.json and dist/manifest.json matches the tag version."
  exit 1
fi

# Create a tag
git tag $tag_version
