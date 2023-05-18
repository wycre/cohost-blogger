{
  description = "cohost-blogger";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.11";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        package = builtins.fromJSON (builtins.readFile ./package.json);
      in
      rec {
        packages = flake-utils.lib.flattenTree rec {
          cohost-blogger = pkgs.buildNpmPackage {
            pname = "cohost-blogger";
            inherit (package) version;

            npmDepsHash = "sha256-hzn0sjxcysxe++IPyhKE/syx3S1Nh2hKGcjvS6UaLvY=";

            doCheck = true;

            postCheck = ''
              mkdir -p $out
              mv build $out/
              ln -s $out/lib/node_modules/cohost-blogger/package.json $out/build/package.json
              ln -s $out/lib/node_modules/cohost-blogger/node_modules $out/build/node_modules
              makeWrapper ${pkgs.nodejs-slim}/bin/node $out/bin/cohost-blogger \
                --add-flags $out/build/index.js \
                --chdir $out/lib/node_modules/cohost-blogger/
            '';

            src = ./.;
          };
        };

        defaultPackage = packages.cohost-blogger;
  }) // {
    nixosModules = {
      cohost-blogger = { config, lib, pkgs, ... }:
      with lib;
      let
        cfg = config.services.cohost-blogger;
      in {
        options.services.cohost-blogger = {
          enable = mkEnableOption "Enables the cohost-blogger server";

          domain = mkOption {
            type = types.nullOr types.str;
            default = null;
            description = "Which domain to host the server under; if disabled, NGINX is not used";
          };
          port = mkOption {
            type = types.port;
            default = 3500;
          };
          package = mkOption {
            type = types.package;
            default = self.defaultPackage.${pkgs.system};
          };
        };

        config = mkIf cfg.enable {
          systemd.services."cohost-blogger" = {
            wantedBy = [ "multi-user.target" ];

            environment = {
              PORT = toString cfg.port;
            };

            serviceConfig = {
              Restart = "on-failure";
              ExecStart = "${getExe cfg.package}";
              DynamicUser = "yes";
              RuntimeDirectory = "cohost-blogger";
              RuntimeDirectoryMode = "0755";
              StateDirectory = "cohost-blogger";
              StateDirectoryMode = "0700";
              CacheDirectory = "cohost-blogger";
              CacheDirectoryMode = "0750";
            };
          };

          services.nginx = mkIf (cfg.domain != null) {
            virtualHosts."${cfg.domain}" = {
              enableACME = true;
              forceSSL = true;
              locations."/" = {
                proxyPass = "http://127.0.0.1:${toString cfg.port}/";
              };
            };
          };
        };
      };
    };
  };
}