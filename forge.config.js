import * as path from "path";
import * as fs from "fs";

export default {
  packagerConfig: {
    asar: true,
    icon: 'desktop/resources/quarky'
  },
  rebuildConfig: {},
  hooks: {
    packageAfterPrune: (_config, buildPath) => {
      // https://stackoverflow.com/a/76816826

      const bufferutilGyp = path.join(
          buildPath,
          'node_modules',
          'bufferutil',
          'build',
          'node_gyp_bins'
      );
      const utf8ValidateGyp = path.join(
          buildPath,
          'node_modules',
          'utf-8-validate',
          'build',
          'node_gyp_bins'
      );

      fs.rmSync(bufferutilGyp, {recursive: true, force: true});
      fs.rmSync(utf8ValidateGyp, {recursive: true, force: true});
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://quarky.nineplus.sh/favicon.ico',
        setupIcon: 'desktop/resources/quarkysetup.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: 'desktop/resources/quarky.png',
          categories: ["Network"],
          homepage: 'https://www.nineplus.sh/quarky',
          priority: 'optional',
          section: 'web'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: 'desktop/resources/quarky.png',
          categories: ["Network"],
          homepage: 'https://www.nineplus.sh/quarky'
        }
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'meower-holdings',
          name: 'quarky'
        },
        draft: false
      }
    }
  ]
};
