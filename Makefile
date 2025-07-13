.PHONY: server

server:
	@echo "Starting Hugo server using Podman..."
	podman-compose up
