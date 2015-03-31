define(function (require, exports, module) {
    main.consumes = ["Plugin", "commands", "tabManager", "fs"];
    main.provides = ["snippets"];
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
            // If we don't have the folder, we need to create it
            fs.readdir("/snippets", function (err, list) {
                if (err) {
                    // No folder found, so we need to make one ...
                    fs.mkdir("/snippets", function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    // Now create a file with the html5 snippet in it
                    fs.writeFile("/snippets/html5", '<!doctype html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title></title>\n</head>\n<body>\n</body>\n</html>\n', function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    // More snippets would go here ...
                    
                    // Error returned above if we have problems, so we don't need this one
                    // return console.error(err);
                }
            });

            // Add the keystrok command
            commands.addCommand({
                name: "snippets",
                bindKey: {
                    mac: "Command-Shift-U",
                    win: "Ctrl-Shift-U"
                },
                exec: function (editor) {
                    // Select the word left - maybe make this a bit smarter
                    editor.ace.selection.selectWordLeft();
                    // Get the value of the text we selected
                    var string = editor.ace.session.getTextRange();
                    // Get the file that goes with this snippet
                    fs.readFile("/snippets/" + string, function (err, content) {
                        if (err){
                            // TODO - add some code here if we don't find a match
                            //        for the snippet in the "string"
                            //        
                            //        This is probably where we want to put 
                            //        help and/or UI for the snippets.
                            //
                            return console.error(err);
                        }
                        // Replace the selected text with our snippet.
                        editor.ace.insert(content);
                    });

                },
                isAvailable: function (editor) {
                    // Not really necessary, this code should probably 
                    // be removed since it always returns true.
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
            "snippets": plugin
        });
    }
});