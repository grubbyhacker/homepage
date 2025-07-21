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

# Target to run ONLY screenshot tests (comparison mode)
screenshot-test:
	# Ensure the 'tests' image is built
	podman-compose build tests
	# Use 'podman-compose run' to execute Playwright test command directly within the 'tests' service container.
	# --rm ensures the container is removed after execution.
	podman-compose run --rm tests npx playwright test screenshot.spec.ts

# Target to GENERATE or UPDATE screenshots (golden images)
# Use this when you intentionally change the UI and need to update the baselines.
update-screenshots:
	# Ensure the 'tests' image is built
	podman-compose build tests
	# Use 'podman-compose run' to execute Playwright test command with --update-snapshots flag.
	# --rm ensures the container is removed after execution.
	podman-compose run --rm tests npx playwright test screenshot.spec.ts --update-snapshots
