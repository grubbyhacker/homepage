# Homepage
This repo is the source and development environment for a static homepage for myself and family. It uses [Hugo](http://gohugo.io) as the templating and content management system. It is greatly over-built as it also serves as a playground for the author to experiment with technologies and techniques.

## Deployment
Deployment is automatic whenever changes are pushed to the main branch via a GitHub action script. The website runs on GitHub Pages with a custom domain name: [https://fleig.us](https://fleig.us).

There is a limit to the number of deploys per month based on the number of GitHub "Actions" that are consumed per month. If I exceed 2000 actions, I guess deploys will fail until the counter is reset the following month.

## 🧑‍💻 Development Setup (MacOS + Nix)

### Run the local server
```
nix develop
hugo server -D --baseURL=http://localhost:1313
```

### Debug Output
This website supports optional Debug output on every page to assist when things go wrong or get confusing. This will be documented in a blog post on the site itself. To run with debug output generation:
```
HUGO_PARAMS_DEBUG=true && hugo server -D --baseURL=http://localhost:1313
```

Debug output generation is controlled by a global configuration variable set in hugo.toml
```
[Params]
  debug = false
```

### Makefile Targets

| Target                  | What it means |
| ----------------------- | ------------- |
| `make test`              |   Runs all tests using containers, generates HTML report.       |
| `make test-ci`            |   Same as `make test` but report is text-only. This is primarily for running in CI.        |
| `make view-report`        |   Runs the Playwright report viewer website in a container. **NOTE:**The CTRL+C signal doesn't seem to propagate into the container so typically I have to use CTRL+Z to put the container in the background, `podman ps -a` to find the container name, and then `podman stop <container-name>`.|
| `make screenshot-test`   |   Runs only the screenshot tests.            |
| `make update-screenshots` |   Runs only the screenshot tests and if there is an image diff, it saves the diff as the new golden.            |


### Nix Info
This project supports a reproducible development environment using [Nix flakes](https://nixos.wiki/wiki/Flakes). Here are some common nix commands in case I forget them. In practice the only command that I use is the first one. Once you are inside of the dev shell, the Hugo binary will be in your execution path - but only then. Of course if I could also use `brew install hugo` but I like the control that Nix gives me. Plus I wanted to learn some Nix.

| Command | Description |
|--------|-------------|
| `nix develop` | Enter the development shell with Hugo and all required tools. |
| `nix flake show` | Inspect available outputs from the flake (packages, devShells, etc.). |
| `nix flake update` | Update all flake inputs and regenerate `flake.lock`. |
| `nix flake lock --update-input <name>` | Update a specific input in `flake.lock`. |
| `nix build` | Build the default package (if defined). Not needed in this repo. |
| `nix store gc` | Garbage collect unused build outputs and store paths. |
| `nix eval .#<output>` | Evaluate and print the value of a specific flake output. |
| `nix profile install nixpkgs#<pkg>` | Install a global package using Nix (e.g. `direnv`). |

### Development Flow
| Command | Description |
|--------|-------------|
|`hugo server -D --baseURL=http://localhost:1313` | When run within the nix development shell this is the hugo debug server. It prints out a localhost url that will dynamically refresh as you make changes. |
| `hugo --cleanDestinationDir --gc` | Removes generated files, Pipes and resources. |
