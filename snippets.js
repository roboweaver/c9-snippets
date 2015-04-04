define(function (require, exports, module) {
    main.consumes = ["Plugin", "Dialog", "ui", "commands", "tabManager", "fs"];
    main.provides = ["snippets"];
    return main;

    /**
     * Main functon 
     * @param {type} options
     * @param {type} imports
     * @param {type} register
     * @returns {snippets_L1.main}
     */
    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var Dialog = imports.Dialog;
        var ui = imports.ui;
        var commands = imports.commands;
        var tabs = imports.tabManager;
        var fs = imports.fs;

        /***** Initialization *****/

        var plugin = new Plugin("Ajax.org", main.consumes);
        var emit = plugin.getEmitter();

        // Create the popup for settings ...
        var snippetSettings = new Dialog("Settings", main.consumes, {
            name: "snippet-settings",
            allowClose: true,
            title: "Snippet Settings",
            width: "50em"
        });
        
        // Draw the dialog ...
        snippetSettings.on("draw", function (e) {
            // Insert HTML
            var markup = require("text!./snippets.html");
            e.html.innerHTML = "<div id='snippetsControlPanel'>TODO write control panel</div>";
            
            // Insert css
            var css = require("text!./snippets.css");
            ui.insertCss(css, options.staticPrefix, snippetSettings);

        });


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
                    fs.writeFile("/snippets/html5", '<!DOCTYPE html>\n<!--\nTo change this template file, open the template from your snippets folder in the editor.\n-->\n<html>\n\t<head>\n\t\t<title>TODO supply a title</title>\n\t\t<meta charset="UTF-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t</head>\n\t<body>\n\t\t<div>TODO write content</div>\n\t</body>\n</html>'
                            , function (err) {
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
                        if (err) {
                            // TODO - add some code here if we don't find a match
                            //        for the snippet in the "string"
                            //        
                            //        This is probably where we want to put 
                            //        help and/or UI for the snippets.
                            //
                            snippetSettings.show();
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

        /** Register the plugin **/
        register(null, {
            "snippets": plugin
        });
    }
});