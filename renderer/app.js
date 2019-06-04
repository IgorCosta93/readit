$ = require('jquery')

const {ipcRenderer} = require('electron');
const items = require('./items.js');
const menu = require('./menu.js');

//Navigate selected item with up/down keys
$(document).keydown((e) => {
  switch(e.key){
    case 'ArrowUp':
      items.changeItem('up')
      break
    case 'ArrowDown':
      items.changeItem('down')
      break
  }
})

$('.open-add-modal').click(() => {
  $('#add-modal').addClass('is-active')
})

$('.close-add-modal').click(() => {
  $('#add-modal').removeClass('is-active')
})

$('#add-button').click(() => {

  let newItemURL = $('#item-input').val()
  if(newItemURL) {

    $('#item-input').prop('disabled', true)
    $('#add-button').addClass('is-loading')
    $('.close-add-modal').addClass('is-disabled')

    ipcRenderer.send('new-item', newItemURL)
  }
})

ipcRenderer.on('new-item-success', (e, item) => {

  items.toReadItems.push(item)

  items.saveItems()
  
  items.addItem(item)

  $('#add-modal').removeClass('is-active')
  $('#item-input').prop('disabled', false).val('')
  $('#add-button').removeClass('is-loading')
  $('.close-add-modal').removeClass('is-disabled')

  if(items.toReadItems.length === 1) $('.read-item:first()').addClass('is-active')
})

$('#item-input').keyup((e) => {
  if(e.key === 'Enter') $('#add-button').click()
})

//FILTER
$('#search').keyup((e) => {
  let filter = $(e.currentTarget).val();
  
  $('.read-item').each((i, el) => {
    $(el).text().toLowerCase().includes(filter) ? $(el).show() : $(el).hide()
  })
})

if(items.toReadItems.length){
  items.toReadItems.forEach(items.addItem)
  $('.read-item:first()').addClass('is-active')
}