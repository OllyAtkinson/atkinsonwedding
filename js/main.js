(function ($) {
    "use strict";

    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });


    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Scroll to Bottom
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scroll-to-bottom').fadeOut('slow');
        } else {
            $('.scroll-to-bottom').fadeIn('slow');
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Gallery carousel
    $(".gallery-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1500,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            },
            1200:{
                items:5
            }
        }
    });
    
})(jQuery);


//FormJS
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("rsvp-form");
    const attendingSelect = document.getElementById("attending-select");
    const dietaryOptions = document.getElementById("dietary-options");
    const menuExplanation = document.getElementById("menu-explanation");
    const additionalInfo = document.getElementById("additional-info");
    const scriptURL = "https://script.google.com/macros/s/AKfycbwqzLXm_5GTDpKP6rN_iN5hEplZmZ9IVRJM7PFx9taQUfYpHJzEmrjQ2LMexBOryySfrQ/exec"; // Replace with your Apps Script deployment URL

    // Show/Hide sections based on Attending selection
    attendingSelect.addEventListener("change", function () {
        if (attendingSelect.value === "attending") {
            dietaryOptions.classList.remove("d-none");
            menuExplanation.classList.remove("d-none");
            additionalInfo.classList.remove("d-none");
        } else {
            dietaryOptions.classList.add("d-none");
            menuExplanation.classList.add("d-none");
            additionalInfo.classList.add("d-none");
        }
    });

    // Form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData);

        // Validation: Ensure all required fields are filled if attending
        if (attendingSelect.value === "attending" && (!formObject.starter || !formObject.main || !formObject.afters || !formObject.dietary)) {
            alert("Please fill in all the menu and dietary preference fields.");
            return;
        }

        // Send data to Google Apps Script
        fetch(scriptURL, { method: "POST", body: formData })
            .then((response) => {
                alert("RSVP submitted successfully!");
                form.reset();
                dietaryOptions.classList.add("d-none");
                menuExplanation.classList.add("d-none");
                additionalInfo.classList.add("d-none");
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
                alert("There was an error submitting your RSVP. Please try again.");
            });
    });

    // Initialize form state
    if (attendingSelect.value !== "attending") {
        dietaryOptions.classList.add("d-none");
        menuExplanation.classList.add("d-none");
        additionalInfo.classList.add("d-none");
    }
});