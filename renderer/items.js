exports.toReadItems = JSON.parse(localStorage.getItem("toReadItems")) || [];

exports.saveItems = () => {
    localStorage.setItem('toReadItems', JSON.stringify(this.toReadItems));
}

exports.selectItem = (e) => {
    $('.read-item').removeClass('is-active');
    $(e.currentTarget).addClass('is-active');
}

exports.changeItem = (direction) => {
    let activeItem = $('.read-item.is-active');

    let newItem = ( direction === 'down' ) ? activeItem.next('.read-item') : activeItem.prev('.read-item');

    if(newItem.length){
        activeItem.removeClass('is-active');
        newItem.addClass('is-active');
    }
}

window.deleteItem = (i = false) => {

    if(i === false) i = ($('.read-item.is-active').index() -1) 

    $('.read-item').eq(i).remove()

    this.toReadItems = this.toReadItems.filter((item, index) => {
        return index !== i
    })

    this.saveItems();

    if(this.toReadItems.length){
        let newIndex = ( i === 0) ? 0 : i -1

        $('.read-item').eq(newIndex).addClass('is-active')
    }else{
        $('#no-items').show()
    }
}

window.openInBrowser = () => {
    if(!this.toReadItems.length) return 

    let targetItem = $('.read-item.is-active');
    
    require('electron').shell.openExternal(targetItem.data('url'))
}

window.openItem = () => {
    if(!this.toReadItems.length) return

    let targetItem = $('.read-item.is-active');

    let contentURL = encodeURIComponent(targetItem.data('url'));

    let itemIndex = targetItem.index() -1;

    let readerWinURL = `file://${__dirname}/reader.html?url=${contentURL}&itemIndex=${itemIndex}`;

    let readerWin = window.open(readerWinURL, targetItem.data('title'));
}

exports.addItem = (item) => {
    $('#no-items').hide()

    let itemHTML = `
        <a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
            <figure class="media-left">
                <p class="image has-shadow is-64x64">
                    <img src="${item.screenshot}">
                </p>
            </figure>
            <h2 class="title is-4 column">${item.title}</h2>
        </a>
    `;

    $('#read-list').append(itemHTML)

    //Attach select event handler
    $('.read-item')
        .off('click, dblclick')
        .on('click', this.selectItem)
        .on('dblclick', window.openItem)
}