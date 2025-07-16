# Fixing Native Module Import Error on Web in Expo React Native Project

## Issue
You are encountering an error during web bundling related to importing a native-only module "react-native/Libraries/Utilities/codegenNativeCommands" from react-native-maps. This usually happens when Metro bundler caches old builds or does not properly resolve platform-specific files.

## Plan to Fix

1. **Clear Metro Bundler Cache and Restart**

Run the following command in your project root to clear Metro cache and start the Expo development server fresh:

```bash
expo start -c
```

The `-c` flag clears the Metro bundler cache.

2. **Verify metro.config.js**

Ensure your `metro.config.js` is in the project root and contains the alias for the native-only module as follows:

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  'react-native/Libraries/Utilities/codegenNativeCommands': 'react-native-web/dist/cjs/Utilities/codegenNativeCommands.js',
};

config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => !ext.startsWith('native'));
config.resolver.sourceExts.unshift('web.tsx', 'web.ts', 'tsx', 'ts', 'jsx', 'js', 'json');

module.exports = config;
```

3. **Check Platform-Specific Files**

Make sure your web components do not import native modules and that native components are only imported in native platform files (`*.native.tsx` or `*.native.js`).

4. **Optional: Add Extra Aliases or Blacklist**

If the error persists, you can add additional aliases or blacklist native modules in `metro.config.js` to prevent them from being bundled on web.

## Summary

- Clear Metro cache with `expo start -c`
- Confirm metro.config.js alias and sourceExts
- Use platform-specific files correctly
- Restart development server

This should resolve the native module import error on web.

---

If you want, I can help you run the cache clearing command and verify the fix.
