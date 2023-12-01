import * as path from "path";
import * as fs from "fs";

export default {
  packagerConfig: {
    asar: true
  },
  rebuildConfig: {},
  hooks: {
    packageAfterPrune: (_config, buildPath) => {
      const gypPath = path.join(
          buildPath,
          'node_modules',
          'bufferutil',
          'build',
          'node_gyp_bins'
      );
      fs.rmSync(gypPath, {recursive: true, force: true}); // https://stackoverflow.com/a/76816826
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
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
