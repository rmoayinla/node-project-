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

//add paths to the model
Todo.add({
    title: {type:String, initial: true, default:'', required: true,},
    image: {type: Types.File, storage: myStorage},
    createdAt: {type: Date, default: Date.now},
    status: {type: Types.Select, options: ['In progress', 'Finished', 'On hold', 'New'], default: 'New'},
    createdBy: {type: Types.Relationship, ref:'Y',},
    updatedAt: {type: Date, default: Date.now},
    description: {type: Types.Html, wysiwyg: true, required: true, default: ''},
    tags:{type: Types.Select, options:['career','family','work','relationship','sport']},
    category:{type: Types.Relationship, ref: 'PostCategory', many: true},
    priority: {type: Types.Select, options:[],},
});

schema = Todo.schema;

//add a url virtual to the field, this can be accessed by keystone.Field('Todo').url //
schema.virtual('url').get(function(){
    return '/todos/'+this.slug;
});

//add this model to keystone fields //
Todo.register();


