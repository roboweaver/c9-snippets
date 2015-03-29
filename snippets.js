define(function (require, exports, module) {
    main.consumes = ["Plugin", "commands", "tabManager", "fs"];
    main.provides = ["brady"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var commands = imports.commands;
        var tabs = imports.tabManager;
        var fs = imports.fs;

        /***** Initialization *****/

        var plugin = new Plugin("Ajax.org", main.consumes);
        var emit = plugin.getEmitter();

        // Load the plugin attributes ...
        function load() {
            console.log('start initializing file system');
            fs.readdir("/snippets", function (err, list) {
                if (err) {
                    fs.mkdir("/snippets", function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    fs.writeFile("/snippets/html5", '<!doctype html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title></title>\n</head>\n<body>\n</body>\n</html>\n', function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    return console.error(err);
                }
            });


            commands.addCommand({
                name: "brady",
                bindKey: {
                    mac: "Command-Shift-U",
                    win: "Ctrl-Shift-U"
                },
                exec: function (editor) {

                    editor.ace.selection.selectWordLeft();
                    var string = editor.ace.session.getTextRange();
                    fs.readFile("/snippets/" + string, function (err, content) {
                        if (err)
                            return console.error(err);
                        editor.ace.insert(content);
                    });

                },
                isAvailable: function (editor) {
                    /**
                     if (editor && editor.ace)
                     return !editor.ace.selection.isEmpty();
                     return false;
                     **/
                    return true;
                }
            }, plugin);
        }

        /***** Methods *****/



        /***** Lifecycle *****/

        plugin.on("load", function () {
            load();
        });
        plugin.on("unload", function () {

        });

        /***** Register and define API *****/

        plugin.freezePublicAPI({
        });

        register(null, {
            "brady": plugin
        });
    }
});