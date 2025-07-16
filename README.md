# homepage
Static homepage for myself and family

## 🧑‍💻 Development Setup (MacOS + Nix)

This project supports a reproducible development environment using [Nix flakes](https://nixos.wiki/wiki/Flakes). To get started:


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

