MOCHA_OPTS= --slow 0 -A
REPORTER = spec

lint-fix:
	./node_modules/.bin/eslint --fix index.js test/test.js

lint-check:
	./node_modules/.bin/eslint index.js test/test.js

commit:
	@node ./node_modules/ac-semantic-release/lib/commit.js

createpr:
	./node_modules/ac-jenkins/bin/createpr.sh

test-release:
	DEBUGMODE=true node ./node_modules/ac-semantic-release/lib/release.js

release:
	node ./node_modules/ac-semantic-release/lib/release.js

cleanup:
	./node_modules/ac-jenkins/bin/cleanup.sh

.PHONY: check
