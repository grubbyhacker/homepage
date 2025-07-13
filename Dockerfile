# Dockerfile
# Use the same Hugo image as your base
FROM ghcr.io/gohugoio/hugo:v0.148.1

# Set the working directory inside the container
WORKDIR /src

# Copy all your project files from the host into the container's /src directory
# This ensures all your content, layouts, static files, and hugo.toml are present
COPY . /src

USER root
RUN chmod -R a+rX /src

# Set the default command for the container.
# This is what will run when the container starts.
# We'll remove --disableFastRender here, as the rebuild action handles that.
CMD ["server", "--source", "/src", "--bind", "0.0.0.0", "--baseURL", "http://localhost:1313/", "--logLevel", "debug"]
