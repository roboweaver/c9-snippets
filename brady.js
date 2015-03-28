define(function(require, exports, module) {
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
        
        function load() {
            commands.addCommand({
                name: "brady",
                bindKey: { 
                    mac: "Command-Shift-U", 
                    win: "Ctrl-Shift-U" 
                },
                exec: function(editor){ 
                    var selection = editor.ace.selection.selectWordLeft();
                    console.log(selection);
                    var word = editor.ace.session.getTextRange();
                    console.log(word);
                    
                    alert(word);
                },
                isAvailable: function(editor) {
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
        
        plugin.on("load", function() {
            load();
        });
        plugin.on("unload", function() {
        
        });
        
        /***** Register and define API *****/
        
        plugin.freezePublicAPI({
            
        });
        
        register(null, {
            "brady": plugin
        });
    }
});