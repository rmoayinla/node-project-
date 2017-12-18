var
   keystone = require('keystone'),
   Types = keystone.Field.Types,
   path = require('path'),
   schema,
   Todo;

Todo = new keystone.List('Todo', {
    autokey: {from: 'title', path: 'slug',},
    searchFields: 'title',
});

var myStorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
      path: '../public/uploads',
      publicPath: '/files',
    },
});

Todo.add({
    title: {type:String, initial: true, default:'', required: true,},
    image: {type: Types.File, storage: myStorage},
    createdAt: {type: Date, default: Date.now},
    status: {type: Types.Select, options: ['In progress', 'Finished', 'On hold', 'New']},
    createdBy: {type: Types.Relationship, ref:'Y',},
    updatedAt: {type: Date, default: Date.now},
    description: {type: Types.Html, wysiwyg: true},
    tags:{type: Types.Select, options:['career','family','work','relationship','sport']},
    category:{type: Types.Relationship, ref: 'PostCategory', many: true},
});

schema = Todo.schema;
schema.virtual('url').get(function(){
    return '/todos/'+this.slug;
});

Todo.register();


