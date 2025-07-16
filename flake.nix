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

      }
    );
}

