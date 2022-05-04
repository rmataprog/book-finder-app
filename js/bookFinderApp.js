$(document).ready(function () {

    var apiKey_1 = 'AIzaSyBgtADwtzgfdpLzpo8fJnnQ033v6ew-EgA';
    var apiKey_2 = 'AIzaSyCCJXdYhQbpgVssG22OCcE3TiCV266QglI';
    
    $(".preloader-wrapper").hide();

    $('form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            type: "GET",
            url: `https://www.googleapis.com/books/v1/volumes?key=${apiKey_1}`,
            data: {
                maxResults: 10,
                q: $('#search_value').val(),
                filter: 'ebooks',
                startIndex: 0
            },
            beforeSend: function() {
                $('ul.collapsible').remove();
                $('img.welcome').hide();
                $(".preloader-wrapper").show();
            },
            complete: function() {
                $(".preloader-wrapper").hide();
            },
            success: function (data) {
                console.log(data);
                var $ul = $(`<ul class="collapsible"></ul>`);
                data.items.forEach((book) => {
                    var li_content = `<li>
                        <div class="collapsible-header">
                            ${book.volumeInfo.title}
                        </div>
                        <div class="collapsible-body">
                            <span>Published date: ${book.volumeInfo.publishedDate}</span><br />
                            <span>Description: ${book.volumeInfo.description}</span>
                        </div>
                        </li>`;
                    $li = $(li_content);
                    $li.appendTo($ul);
                });
                $ul.appendTo(`div.section:last`);
                var elems = document.querySelectorAll('.collapsible');
                var instances = M.Collapsible.init(elems);
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});