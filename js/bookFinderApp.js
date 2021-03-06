$(document).ready(function () {

    var BOOK_APP = {
        pages: null,
        totalItems: null,
        searchTerm: null
    };

    var apiKey_1 = 'AIzaSyBgtADwtzgfdpLzpo8fJnnQ033v6ew-EgA';
    var apiKey_2 = 'AIzaSyCCJXdYhQbpgVssG22OCcE3TiCV266QglI';
    
    $(".preloader-wrapper").hide();

    $("#search_value").val('');

    $('form').on('submit', function (e) {
        e.preventDefault();
        if($("#search_value").val().length === 0) {
            BOOK_APP.searchTerm = '';
            $("#search_value").removeClass('valid').addClass('invalid');
        } else {
            BOOK_APP.searchTerm = $(this).find('[type="text"]').val();
            $("#search_value").removeClass('invalid').addClass('valid');
            var input = {
                query: BOOK_APP.searchTerm,
                index: 0
            };
            builder(input);
        }
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
                try {
                    var $ul = $(`<ul class="collapsible"></ul>`);
                    data.items.forEach((book) => {
                        var li_content = `<li>
                            <div class="collapsible-header">
                                <div class="row">
                                    <div class="col s3 m2">
                                        <img src="${book.volumeInfo.imageLinks === undefined ? '' : book.volumeInfo.imageLinks.smallThumbnail}" alt="No image">
                                    </div>
                                    <div class="col s8 offset-s1 m9 offset-m1">
                                        <p>${book.volumeInfo.title}<br />
                                            Authors: ${book.volumeInfo.authors === undefined || book.volumeInfo.authors.length === 0 ? 'No data' : book.volumeInfo.authors.reduce((acc, author, index) => { return index + 1 === book.volumeInfo.authors.length ? acc + author : acc + author + ', ' }, '')} <br />
                                            Published date: ${book.volumeInfo.publishedDate === undefined ? '' : (new Date(book.volumeInfo.publishedDate)).toDateString()} <br />
                                            Publisher: ${book.volumeInfo.publisher === undefined ? '' : book.volumeInfo.publisher}<br />
                                            Categories: ${book.volumeInfo.categories === undefined || book.volumeInfo.categories.length === 0 ? 'No data' : book.volumeInfo.categories.reduce((acc, category, index) => { return index + 1 === book.volumeInfo.categories.length ? acc + category : acc + category + ', ' }, '')} <br />
                                            Page count: ${book.volumeInfo.pageCount === undefined ? '' : book.volumeInfo.pageCount}<br />
                                            ${book.volumeInfo.averageRating === undefined ? '' : book.volumeInfo.averageRating}<i class="material-icons">star</i> | ${book.volumeInfo.ratingsCount === undefined ? '' : book.volumeInfo.ratingsCount}<i class="material-icons">person</i>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="collapsible-body">
                                <span>Description: ${book.volumeInfo.description === undefined ? '' : book.volumeInfo.description}</span><br />
                                <a class="right" href="${book.volumeInfo.previewLink === undefined ? '' : book.volumeInfo.previewLink}" target="_blank">Preview</a>
                            </div>
                            </li>`;
                        $li = $(li_content);
                        $li.appendTo($ul);
                    });
                    $ul.appendTo(`div.section:eq(1)`);
                    var elems = document.querySelectorAll('.collapsible');
                    var instances = M.Collapsible.init(elems);
                    BOOK_APP.totalItems = input.index === 0 ? data.totalItems : BOOK_APP.totalItems;
                    BOOK_APP.pages = Math.ceil(BOOK_APP.totalItems/10);
                    if(input.index === 0) {

                        $('ul.pagination').remove();

                        $ulPag = $(`<ul class="pagination"></ul>`);

                        $ulPag.append($(`<li class="disabled"><a><i class="material-icons">chevron_left</i></a></li>`));

                        for(var i = 1; i <= BOOK_APP.pages; i++) {
                            if(i === 1) {
                                $ulPag.append($(`<li class="active"><a>${i}</a></li>`));
                            } else {
                                $ulPag.append($(`<li class="waves-effect"><a>${i}</a></li>`));
                            }
                        };

                        $ulPag.append($(`<li class="waves-effect"><a><i class="material-icons">chevron_right</i></a></li>`));

                        $ulPag.find('li').not('li:first').not('li:last').each(function(index) {
                            if(index > 8) {
                                $(this).hide();
                            }
                        });

                        $ulPag.click(function (e) { 
                            onClick(e);
                        });

                        $ulPag.appendTo(`div.section:last`);

                        var onClick = function(e) {
                            e.preventDefault();
                            var $target = $(e.target);
                            if(e.target && ['A', 'I'].includes(e.target.tagName)) {
                                if(['chevron_left', 'chevron_right'].includes($target.text())) {
                                    if($target.text() === 'chevron_right' && $target.parent().parent().hasClass('disabled') === false) {
                                        builder({
                                            query: BOOK_APP.searchTerm,
                                            index: (parseInt($('li.active').next().text()) - 1)*10
                                        });
                                        $('li.active').next().removeClass('waves-effect').addClass('active');
                                        $('li.active:eq(0)').removeClass('active').addClass('waves-effect');
                                    } else if ($target.text() === 'chevron_left' && $target.parent().parent().hasClass('disabled') === false) {
                                        builder({
                                            query: BOOK_APP.searchTerm,
                                            index: (parseInt($('li.active').prev().text()) - 1)*10
                                        });
                                        $('li.active').prev().removeClass('waves-effect').addClass('active');
                                        $('li.active:eq(1)').removeClass('active').addClass('waves-effect');
                                    }
                                } else {
                                    $('li.active').removeClass('active').addClass('waves-effect');
                                    $target.parent().removeClass('waves-effect').addClass('active');
                                    builder({
                                        query: BOOK_APP.searchTerm,
                                        index: (parseInt($target.text()) - 1)*10
                                    });
                                }

                                if(parseInt($('li.active').text()) > 1) {
                                    $('li:first').removeClass('disabled').addClass('waves-effect');
                                } else {
                                    $('li:first').addClass('disabled').removeClass('waves-effect');
                                }

                                if(parseInt($('li.active').text()) === BOOK_APP.pages) {
                                    $('li:last').addClass('disabled').removeClass('waves-effect');
                                } else {
                                    $('li:last').removeClass('disabled').addClass('waves-effect');
                                }

                                if(parseInt($('li.active').text()) > 5 && parseInt($('li.active').text()) < ($('ul.pagination').children().length - 5)) {
                                    $('ul.pagination li').not('li:first').not('li:last').each(function () {
                                        $(this).hide();
                                    });

                                    $('li.active').show();
                                    $('li.active').next().show();
                                    $('li.active').next().next().show();
                                    $('li.active').next().next().next().show();
                                    $('li.active').next().next().next().next().show();
                                    $('li.active').prev().show();
                                    $('li.active').prev().prev().show();
                                    $('li.active').prev().prev().prev().show();
                                    $('li.active').prev().prev().prev().prev().show();
                                } else if( parseInt($('li.active').text()) <= 5) {
                                    $('ul.pagination li').not('li:first').not('li:last').each(function(index) {
                                        if(index > 8) {
                                            $(this).hide();
                                        } else {
                                            $(this).show();
                                        }
                                    });
                                }
                            };
                        };
                    }
                } catch (e) {
                    console.log(`name: ${e.name} - message: ${e.message}`);
                    $p = $(`<p class="error red-text text-darken-2 center-align">There was an error getting the information: name: ${e.name} - message: ${e.message}</p>`);
                    $p.appendTo(`div.section:eq(2)`);
                }
            },
            error: function(err) {
                $p = $(`<p class="error red-text text-darken-2 center-align">There was an error getting the information: ${err.statusText}</p>`);
                $p.appendTo(`div.section:eq(2)`);
            }
        });
    }
});