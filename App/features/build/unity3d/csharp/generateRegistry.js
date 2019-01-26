define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        template = require('text!./registryTemplate.txt'),
        getSlug = require('infrastructure/getSlug'),
        db = require('infrastructure/assetDatabase');

    function generateRegistry(context, dataId, entityName, codeFileName, useInstance){
        var entries = db[dataId].entries;
        var declarationCode = '';
        var absoluteCodePath = path.join(context.codeOutputDirectory, codeFileName);
        var entityType = entityName + (useInstance ? 'Instance' : 'Model');

        entries.forEach(function(item){
            var slug = getSlug(item.name);
            declarationCode += '        public static {entityType} ' + slug + ' { get { return ';

            if(useInstance){
                declarationCode += 'Game.Registry.Get<{entityType}>(new Guid("' + item.id + '"));';
            }else{
                declarationCode += 'Game.Model.Get<{entityType}>(new Guid("' + item.id + '"));'
            }

            declarationCode += ' } }\n';
        });

        var output = template.replace('{field declarations}', declarationCode);
        output = output.replace(/{entity}/g, entityName);
        output = output.replace(/{entityType}/g, entityType);

        fileSystem.write(absoluteCodePath, output);

        context.completed.push(absoluteCodePath);
    }

    return generateRegistry;
});