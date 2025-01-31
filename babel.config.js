module.exports = function (api) {
    api.cache(true);

    return {
        presets: [
            "babel-preset-expo",
            ["nativewind/babel", { jsxImportSource: "nativewind" }]
        ],

        plugins: [
            ["module-resolver", {
                root: ["./"],
                alias: {
                    "@": "./",
                    "tailwind.config": "./tailwind.config.js"
                }
            }],
            "module:react-native-dotenv"
        ]
    };
};
