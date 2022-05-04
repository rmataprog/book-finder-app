$(document).ready(function () {

    var BOOK_APP = {
        totalItems: null,
        searchTerm: null
    };

    var apiKey_1 = 'AIzaSyBgtADwtzgfdpLzpo8fJnnQ033v6ew-EgA';
    var apiKey_2 = 'AIzaSyCCJXdYhQbpgVssG22OCcE3TiCV266QglI';
    
    $(".preloader-wrapper").hide();

    $('form').on('submit', function (e) {
        e.preventDefault();
        BOOK_APP.searchTerm = $(this).find('[type="text"]').val();
        var input = {
            query: BOOK_APP.searchTerm,
            index: 0
        };
        builder(input);
    });

    function builder(input) {
        console.log('called');
        $.ajax({
            type: "GET",
            url: `https://www.googleapis.com/books/v1/volumes?key=${apiKey_1}`,
            data: {
                maxResults: 10,
                q: input.query,
                filter: 'ebooks',
                startIndex: input.index
            },
            beforeSend: function() {
                $('p.error').remove();
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
                $ul.appendTo(`div.section:eq(2)`);
                var elems = document.querySelectorAll('.collapsible');
                var instances = M.Collapsible.init(elems);
                BOOK_APP.totalItems = input.index === 0 ? data.totalItems : BOOK_APP.totalItems;
                if(input.index === 0) {
                    var onClick = function(e) {
                        e.preventDefault();
                        var target = e.target;
                        if(target && target.tagName === 'A') {
                            builder({
                                query: BOOK_APP.searchTerm,
                                index: parseInt(target.textContent)*10
                            });
                        };
                    };

                    $('ul.pagination').remove();

                    $ulPag = $(`<ul class="pagination"></ul>`);

                    var pages = Math.ceil(BOOK_APP.totalItems/10);

                    for(var i = 1; i <= pages; i++) {
                        $ulPag.append($(`<li class="waves-effect"><a>${i}</a></li>`));
                    };

                    $ulPag.click(function (e) { 
                        onClick(e);
                    });

                    $ulPag.appendTo(`div.section:last`);
                }
            },
            error: function(err) {
                $p = $(`<p class="error red-text text-darken-2 center-align">There was an error getting the information: ${err.statusText}</p>`);
                $p.appendTo(`div.section:last`);
            }
        });
    }
});