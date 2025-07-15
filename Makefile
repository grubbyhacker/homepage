.PHONY: server

server:
	@echo "Starting Hugo server using Podman..."
	podman-compose up

# Nix-based Hugo dev server
nix-server:
	@echo "Starting Hugo server using Nix dev shell..."
	nix develop --command hugo server --bind 0.0.0.0 --buildDrafts --navigateToChanged

