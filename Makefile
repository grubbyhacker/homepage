.PHONY: test test-ci view-report

test:
	podman-compose up --exit-code-from tests

test-ci:
	podman-compose down --rmi all || true
	podman-compose -f docker-compose.yaml build tests
	CI=true podman-compose -f docker-compose.yaml run --rm tests

view-report:
	podman-compose build tests
	podman run --rm -p 9323:9323 -v $(shell pwd)/tests/playwright-report:/tests/playwright-report:Z localhost/homepage_tests:latest npx playwright show-report /tests/playwright-report --host 0.0.0.0