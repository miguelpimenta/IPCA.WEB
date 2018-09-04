'use strict';
/* 'esversion: 6'; */

const errorMsg = "Something didn't work has expected!";
let giphyRating = "G";
let numImgs = 8;
let baseAddress = "http://127.0.0.1:3000";

function Loaded() {
    document.getElementById("tbSearch").placeholder = "Input search";
    RefreshCategories();
    GetGifs(numImgs);
}

function Search(btnId) {
    // !!!
    swal({
        title: 'WIP',
        text: btnId + " Not implemented",
        confirmButtonColor: '#26ADE4',
        confirmButtonText: 'Ok!',
        reverseButtons: true,
        allowOutsideClick: false,
    });
}

function showMsg(type, message) {
    swal({
        type: type === 0 ? 'error' : (type === 1 ? 'success' : 'information'),
        title: type === 0 ? 'Error' : (type === 1 ? 'Success' : 'Information'),
        confirmButtonColor: '#26ADE4',
        confirmButtonText: 'Ok!',
        text: message != null ? message : "???"
    });
}

/* CATEGORIES */
function RefreshCategories() {
    $.ajax({
        type: "GET",
        url: baseAddress + "/categories/listDiv",
        cache: false,
        success: function(response) {
            $(".categories").empty();
            $(".categories").html(response);
        },
        failure: function(response) {

        },
        timeout: 3000
    });
}

function NewCategory() {
    swal({
            title: 'Add new Category',
            html: `
            <dic class="container03">
                <div class="field">
                    Name:
                    <input class="input" type="text" id="Name">
                    </p>
                </div>
                <div class="field">
                    Description:
                    <input class="input" type="text" id="Description">
                    </p>
                </div>
            </dic>
    `,
            showCancelButton: true,
            confirmButtonColor: '#26ADE4',
            confirmButtonText: 'Ok!',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancel!',
            reverseButtons: true,
            allowOutsideClick: false,
            inputAttributes: {
                autocapitalize: 'on'
            },
            showLoaderOnConfirm: true,
            preConfirm: function() {
                return new Promise((resolve, reject) => {
                    resolve({
                        name: $('input[id="Name"]').val(),
                        description: $('input[id="Description"]').val()
                    });
                    reject();
                });
            }
        })
        .then(function(data) {
            $.ajax({
                type: 'POST',
                url: baseAddress + '/categories',
                data: { name: data.value.name, description: data.value.description },
                crossDomain: true,
                cache: false,
                success: function(response) {
                    console.log(response);
                    showMsg(1, response.message);
                    RefreshCategories();
                },
                failure: function(response) {
                    showMsg(0, errorMsg);
                },
                error: function(response) {
                    console.log(response);
                    showMsg(0, response.responseJSON.message);
                },
                /* statusCode: {
                    200: function(xhr) {
                        showMsg(1, 'Category added successfully.');
                        RefreshCategories();
                    },
                    404: function(xhr) {
                        showMsg(0, errorMsg);
                    }
                }, */
                timeout: 3000
            });
        });
}

function DelCategory() {
    var options = {};
    $.ajax({
        type: "GET",
        url: baseAddress + "/categories",
        crossDomain: true,
        cache: false,
        success: function(categories) {
            $.map(categories, function(o) {
                options[o._id] = o.name;
            });
            swal({
                title: 'Delete Category',
                input: 'select',
                inputOptions: options,
                showCancelButton: true,
                confirmButtonColor: '#26ADE4',
                confirmButtonText: 'Ok!',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancel!',
                reverseButtons: true,
                allowOutsideClick: false,
                preConfirm: function(value) {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: value
                        });
                        reject();
                    });
                }
            }).then(function(data) {
                console.log("Delete: " + data.value.id);
                $.ajax({
                    type: "DELETE",
                    url: baseAddress + "/categories/" + data.value.id,
                    crossDomain: true,
                    cache: false,
                    success: function(response) {
                        showMsg(1, response.message);
                        RefreshCategories();
                    },
                    failure: function(response) {
                        showMsg(0, errorMsg);
                    },
                    error: function(response) {
                        showMsg(0, response.responseJSON.message);
                    },
                    timeout: 3000
                });
            });
        },
        failure: function(response) {
            showMsg(0, errorMsg);
        },
        error: function(response) {
            showMsg(0, errorMsg);
        }
    });
}

function UpdateCategory() {

}

/* GIFS */
function DelGif() {
    var html;
    $.ajax({
        type: "GET",
        url: baseAddress + '/gyphys/dellist',
        crossDomain: true,
        cache: false,
        success: function(response) {
            swal({
                title: 'Delete Gif',
                html: response,
                showCancelButton: true,
                confirmButtonColor: '#26ADE4',
                confirmButtonText: 'Ok!',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancel!',
                reverseButtons: true,
                allowOutsideClick: false,
                preConfirm: function(value) {
                    return new Promise((resolve, reject) => {
                        resolve({
                            id: $('select[id="gif"]').val(),
                        });
                        reject();
                    });
                }
            }).then(function(data) {
                console.log("Delete: " + data.value.id);
                $.ajax({
                    type: "DELETE",
                    url: baseAddress + "/gyphys/" + data.value.id,
                    crossDomain: true,
                    cache: false,
                    success: function(response) {
                        showMsg(1, response.message);
                        GetGifs(numImgs);
                    },
                    failure: function(response) {
                        showMsg(0, errorMsg);
                    },
                    error: function(response) {
                        showMsg(0, errorMsg);
                    },
                    timeout: 3000
                });
            });
        },
        failure: function(response) {
            showMsg(0, errorMsg);
        },
        error: function(response) {
            showMsg(0, errorMsg);
        }
    });
}

function GifsList(limit) {
    console.log("GifsList");
    $.ajax({
        method: "GET",
        url: baseAddress + "/gyphys/list/" + limit,
        data: {},
        crossDomain: true,
        success: function(response) {
            console.log(response);
            return response;
        },
        error: function() {
            showMsg(0, errorMsg);
        }
    });
}

function GetGifs(limit) {
    console.log("GetGifs");
    $.ajax({
        method: "GET",
        url: baseAddress + "/gyphys/list/" + limit,
        data: {},
        crossDomain: true,
        success: function(response) {
            console.log(response);
            AddGif(response);
        },
        error: function() {
            showMsg(0, errorMsg);
        }
    });
}

function SearchByCatId(obj) {
    let id = obj.id;
    $.ajax({
        method: "GET",
        url: baseAddress + "/gyphys/categories/" + id,
        data: {},
        crossDomain: true,
        success: function(response) {
            AddGif(response);
        },
        error: function() {
            showMsg(0, errorMsg);
        }
    });
}

var AddGif = function(response) {
    $('.gifs').empty();
    var results = response.gifs;
    results.map;
    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            GetImage(results[i]._id);
        }
    } else {
        console.log('empty');
    }
    console.log("Added Gifs");
};

function GetImage(id) {
    $.ajax({
        method: "GET",
        url: baseAddress + "/gyphys/image/" + id,
        data: {},
        crossDomain: true,
        success: function(response) {
            let line = "<div class=gif><img id='gyphy' src=" + response + "></div>";
            $(".gifs").append(line);
        },
        error: function() {
            console.log("GetImage Failed!");
        }
    }).done(function() {
        console.log("All gifs loaded");
    });
}

// Show Gif Image on Add New Gif
function ReadFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log('file read');
            $('#loadedGif')
                .attr('src', e.target.result)
                .width(150)
                .height(200);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function NewGif() {
    $.ajax({
        type: "GET",
        url: baseAddress + "/gyphys/newGif",
        cache: false,
        success: function(response) {
            swal({
                    title: 'Add new Gif',
                    html: response,
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancel!',
                    showConfirmButton: false,
                    /* confirmButtonColor: '#26ADE4',
                    confirmButtonText: 'Ok!',
                    reverseButtons: true,
                    input: 'file',
                    inputAttributes: {
                        name: "upload[]",
                        id: "image",
                        multiple: "single"
                    }, */
                    allowOutsideClick: true,
                    preConfirm: function() {
                        return new Promise((resolve, reject) => {
                            resolve({
                                name: $('input[id="name"]').val(),
                                description: $('input[id="description"]').val(),
                                category: $('select[id="category"]').val(),
                                rating: $('select[id="rating"]').val(),
                                tags: $('input[id="tags"]').val(),
                                image: $('file[id="image"]')[0]
                            });
                            reject();
                        });
                    }
                })
                .then(function(data) {
                    var formData = new FormData();
                    formData.append(name, data.value.name);
                    formData.append(description, data.value.description);
                    formData.append(category, data.value.category);
                    formData.append(rating, data.value.rating);
                    formData.append(name, data.value.tags);
                    formData.append(image, data.value.image);
                    $.ajax({
                        type: "POST",
                        url: baseAddress + "/gyphys",
                        crossDomain: true,
                        dataType: 'json',
                        cache: false,
                        headers: { "Content-Type": "multipart/form-data" },
                        data: formData,
                        /* data: {
                            name: data.value.name,
                            description: data.value.description,
                            category: data.value.category,
                            rating: data.value.rating,
                            tags: data.value.tags,
                            image: data.value.image,
                        }, */
                        success: function(response) {
                            console.log(response);
                            showMsg(1, response.message);
                            GetGifs(numImgs);
                        },
                        failure: function(response) {
                            showMsg(0, errorMsg);
                        },
                        error: function(response) {
                            showMsg(0, response.responseJSON.message);
                        },
                        done: function(response) {
                            showMsg(1, response.message);
                            GetGifs(numImgs);
                        }
                    });
                });
        },
        failure: function(response) {

        },
    });

}