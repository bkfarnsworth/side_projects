// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

console.log('popup.js :: 5');

// Search the bookmarks when entering the search keyword.
$(function() {

  console.log('popup.js :: 8');

  $('#search').change(function() {
     $('#bookmarks').empty();
     dumpBookmarks($('#search').val());
  });
});




function myNewFunction(){

  // alert('working?')

  // chrome.bookmarks.getRecent(1, function (result) {
  //   console.log('result: ', result);
  // })


  // chrome.bookmarks.create({
  //   title: 'brand new bookmark',
  //   url: 'https://www.google.com',
  //   parentId: "1",
  //   index: 0
  // })
  

  //this is the whole thing
  // chrome.bookmarks.getTree(function (result) {
  //   console.log('result: ', result);
  // })

      // "default_popup": "popup.html"
// 

  
  //this is the work folder
  // chrome.bookmarks.getSubTree('326', function (result) {
  //   console.log('result: ', result);
  // })
  
  // if(add){


  var mainWorkBookmarks = [];
  // var add = false;


chrome.bookmarks.getSubTree('1', function (result) {


  var add = !(result[0].children.filter(function (child) {
    return child.url === 'https://lodash.com/docs';
  }).length)



  //this is the main bookmarks within work
  //I should make this based off the name instead...I don't know how these ids work
  chrome.bookmarks.getSubTree('442', function (result) {
    console.log('result: ', result);

    result[0].children.reverse().forEach(function (child) {
        
      console.log('child: ', child);
      mainWorkBookmarks.push(child);

      if(add){
        chrome.bookmarks.create({
          title: child.title,
          url: child.url,
          parentId: '1',
          index: 1
        })
      }

    })

    console.log('popup.js :: 79');
    var justUrls = mainWorkBookmarks.map(function(bookmark){
      return bookmark.url;
    });

    console.log('justUrls: ', justUrls);


    if(!add){
      //bookmarks bar
      chrome.bookmarks.getSubTree('1', function (result) {

        console.log('popup.js :: 89');
        result[0].children.forEach(function (child) {



          if(justUrls.indexOf(child.url) > -1){

            console.log('child.title: ', child.title);

            //remove the child.
            chrome.bookmarks.remove(child.id);
            // break;
          }
        })
      }); 
    }

  })

})

}





// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}
function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }
  return list;
}
function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).indexOf(query) == -1) {
        return $('<span></span>');
      }
    }
    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);
    /*
     * When clicking on a bookmark in the extension, a new tab is fired with
     * the bookmark url.
     */
    anchor.click(function() {
      chrome.tabs.create({url: bookmarkNode.url});
    });
    var span = $('<span>');
    var options = bookmarkNode.children ?
      $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
      $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
        'href="#">Delete</a>]</span>');
    var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
      '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
      '</td></tr></table>') : $('<input>');
    // Show add and edit links when hover over.
        span.hover(function() {
        span.append(options);
        $('#deletelink').click(function() {
          $('#deletedialog').empty().dialog({
                 autoOpen: false,
                 title: 'Confirm Deletion',
                 resizable: false,
                 height: 140,
                 modal: true,
                 overlay: {
                   backgroundColor: '#000',
                   opacity: 0.5
                 },
                 buttons: {
                   'Yes, Delete It!': function() {
                      chrome.bookmarks.remove(String(bookmarkNode.id));
                      span.parent().remove();
                      $(this).dialog('destroy');
                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               }).dialog('open');
         });
        $('#addlink').click(function() {
          $('#adddialog').empty().append(edit).dialog({autoOpen: false,
            closeOnEscape: true, title: 'Add New Bookmark', modal: true,
            buttons: {
            'Add' : function() {
               chrome.bookmarks.create({parentId: bookmarkNode.id,
                 title: $('#title').val(), url: $('#url').val()});
               $('#bookmarks').empty();
               $(this).dialog('destroy');
               window.dumpBookmarks();
             },
            'Cancel': function() {
               $(this).dialog('destroy');
            }
          }}).dialog('open');
        });
        $('#editlink').click(function() {
         edit.val(anchor.text());
         $('#editdialog').empty().append(edit).dialog({autoOpen: false,
           closeOnEscape: true, title: 'Edit Title', modal: true,
           show: 'slide', buttons: {
              'Save': function() {
                 chrome.bookmarks.update(String(bookmarkNode.id), {
                   title: edit.val()
                 });
                 anchor.text(edit.val());
                 options.show();
                 $(this).dialog('destroy');
              },
             'Cancel': function() {
                 $(this).dialog('destroy');
             }
         }}).dialog('open');
        });
        options.fadeIn();
      },
      // unhover
      function() {
        options.remove();
      }).append(anchor);
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('popup.js :: 130');
  // dumpBookmarks();
  myNewFunction();
});

// chrome.browserAction.onClicked.addListener(function(tab) { 
//   alert('icon clicked')

// });

