window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    var header = document.getElementById("header");
    
    // Get the height of the header 
    var headerHeight = header.offsetHeight;

    // Show fixed banner when scrolled past the header
    if (window.pageYOffset > headerHeight) {
        header.classList.add("scrolling");
    }
    else {
        header.classList.remove("scrolling");
    }
}