{
  description = "Hugo site dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        hugo = pkgs.hugo;
      in {
        # Dev shell with Hugo
        devShells.default = pkgs.mkShell {
          buildInputs = [ pkgs.hugo ];
          shellHook = ''
            echo "✨ Hugo dev shell ready. Run: hugo server -D"
          '';
        };

        # Optional: Build a Docker image with Hugo installed
        packages.default = pkgs.dockerTools.buildLayeredImage {
          name = "hugo-dev";
          tag = "latest";
          contents = [ hugo ];
          config = {
            Cmd = [ "hugo" "server" "--bind=0.0.0.0" "--baseURL=http://localhost:1313" "--watch" "--buildDrafts" ];
            WorkingDir = "/src";
            Volumes = { "/src" = {}; };
          };
        };
      }
    );
}

