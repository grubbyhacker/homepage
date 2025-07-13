.PHONY: server

server:
	@echo "Starting Hugo server using Podman..."
	podman run --rm -it \
		-v $(PWD):/src \
		-p 1313:1313 \
		-w /src \
		ghcr.io/gohugoio/hugo:v0.148.1 \
		server --source /src --bind 0.0.0.0
