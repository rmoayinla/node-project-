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

//add a url virtual to the field, this can be accessed by keystone.List('Todo').url //
schema.virtual('url').get(function(){
    return '/todos/'+this.slug;
});

//add a inProgess method to determine if the status of the todo is 'In progress' 
//i.e keystone.List('Todo').inProgress()
schema.methods.inProgress = function(){
    return this.state.toLowerCase() === 'in progress';
}

//
Todo.defaultColumns = 'title, state|20%, createdBy, description';

//relationships 
Todo.relationship({ ref: 'Y', refPath: 'name', path: 'author' });

//add this model to keystone fields //
Todo.register();


