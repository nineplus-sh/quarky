import globals from 'globals';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsdoc from 'eslint-plugin-jsdoc';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from 'eslint-plugin-vitest';
import vitestGlobals from 'eslint-plugin-vitest-globals';
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
    { ignores: ['dist'] },
    {
        files: ['desktop/**/*.{js,jsx}'],
        languageOptions: {
            globals: globals.node
        },
        rules: {
            ...js.configs.recommended.rules
        }
    },
    {
        files: ['src/**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: { react: { version: '18.3' } },
        plugins: {
            jsdoc,
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            reactCompiler
        },
        rules: {
            ...js.configs.recommended.rules,
            ...jsdoc.configs['flat/recommended-typescript-flavor'].rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,

            'react/jsx-no-target-blank': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react/prop-types': 'off',
            "reactCompiler/react-compiler": 'warn'
        },
    },
    {
        files: ['src/**/*.test.{js,jsx}'],
        plugins: {
            vitest,
            vitestGlobals
        },
        rules: {
            ...vitest.configs.recommended.rules,
        },
        ...testingLibrary.configs['flat/react']
    }
]