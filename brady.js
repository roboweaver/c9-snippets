define(function(require, exports, module) {
    main.consumes = ["Plugin", "commands", "tabManager"];
    main.provides = ["brady"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var commands = imports.commands;
        var tabs = imports.tabManager;
        
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
                    
                    editor.ace.selection.selectWordLeft();
                    string = editor.ace.session.getTextRange();
                    fs.readFile("/snippets/"+string, function(err, content){
                    if (err) return console.error(err);
                     editor.ace.insert(content);
                    });

                },
                isAvailable: function(editor) {
                    if (editor && editor.ace)
                        return !editor.ace.selection.isEmpty();
                    return false;
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