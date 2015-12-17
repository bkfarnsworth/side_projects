var Evernote = Application('Evernote');

var list = Evernote.findNotes('AUTOMATE EVERNOTE');

list.forEach(function(item){

	var title = item.title();

	console.log(title);

})

Evernote.activate(); 