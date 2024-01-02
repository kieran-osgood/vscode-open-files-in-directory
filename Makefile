# Updating Personal Access Token
login:
	vsce login ko-dev
# Setting branch avoids relative links in readme breaking
build:
	vsce package --githubBranch main
publish:
	vsce publish --githubBranch main