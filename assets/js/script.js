$( document ).ready(function()
{
    var desktop = ( Modernizr.mq('(min-width: 768px)') );

    $('#nav').fixTo('.frame');
    $( 'a[rel="external"]' ).attr( 'target','_blank' );

    smoothScroll.init();
    gumshoe.init();

    $('.portfolio-items').multipleFilterMasonry({
        itemSelector: '.tile',
        filtersGroupSelector:'.filters'
    }).on( 'layoutComplete',function() {
        gumshoe.setDistances();
    } );

    $('.filters input:checkbox').change(function(){
        $cb = $(this);
        if($cb.is(':checked')) {
            $cb.parent('label').addClass('active');
        } else {
            $cb.parent('label').removeClass('active');
        }
    });

    $('.portfolio-items').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery:{
            enabled:true
        },
        mainClass: 'mfp-with-zoom',
        zoom: {
            enabled: true,
            duration: 300,
            easing: 'ease-in-out',
            opener: function(openerElement) {
                return openerElement.is('img') ? openerElement : openerElement.find('img');
            }
        }
    });

    jQuery.validator.addMethod( 'phoneUK',function( phone_number,element ) {
        return this.optional( element ) || phone_number.length > 9 &&
            phone_number.match(/^(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}$/);
    },'Please specify a valid Contact number' );

    $( '#contactForm' ).validate({
        rules: {
            email: {
                require_from_group: [ 1,'.contact-group' ]
            },
            number: {
                require_from_group: [ 1,'.contact-group' ]
            }
        },
        messages: {
            email: {
                require_from_group: 'Please provide a means of Contact'
            },
            number: {
                require_from_group: 'Please provide a means of Contact'
            }
        },
        submitHandler: function( form )
        {
            var $form          = $(form);
            var $inputs        = $form.find( 'input,textarea,button' );
            var sData          = $form.serializeArray();
            var honeypotFilled = false;
            var honeypotIndex  = -1;

            $.each( sData,function( i,field ) {
                if ( field.name == 'fax' ) {
                    // Flag as spam if filled
                    if ( field.value !== '' ) {
                        honeypotFilled = true;
                    }
                    // Store index
                    honeypotIndex = i;
                    // Break out of each loop
                    return false;
                }
            });

            // Remove field from submission
            if ( honeypotIndex > -1 ) {
                sData.splice( honeypotIndex,1 );
            }

            $inputs.prop( 'disabled',true );

            sData.push( { name : '_subject', value : 'New justcarpentry.net Contact Form Enquiry' } );
            sData.push( { name : '_format' , value : 'plain' } );

            if ( !honeypotFilled ) { // Handle submission
                var request = $.ajax({
                    url  : 'https://formspree.io/f/xvoynked',
                    type : 'post',
                    data : sData,
                    dataType: 'json'
                });

                // Success
                request.done( function ( response ) {
                    if ( typeof response.ok !== 'undefined' && response.ok === true )
                    {
                        $form.fadeOut().before( '<div class="form-success" style="display: none;"><p>Thanks for your message, I will get back to you soon.</p></div>' );
                        setTimeout
                        (
                            function() {
                                $('.form-success').fadeIn();
                                gumshoe.setDistances();
                            },
                            600
                        );
                    }
                });

                // Failure
                request.fail( function ( jqXHR,textStatus,errorThrown ) {
                    alert( 'Error submitting form, please try again.' );
                });

                request.always( function () {
                    $inputs.prop( 'disabled',false );
                });
            } else { // Feign success
                $form.fadeOut().before( '<div class="form-success" style="display: none;"><p>Thanks for your message, I will get back to you soon.</p></div>' );
                setTimeout
                (
                    function() {
                        $('.form-success').fadeIn();
                        gumshoe.setDistances();
                    },
                    600
                );
            }
        }
    });

    $( window ).resize(function() {
        if ( desktop && ! ( Modernizr.mq('(min-width: 768px)') ) ) {
            desktop = false; gumshoe.setDistances();
        } else if ( ! desktop && ( Modernizr.mq('(min-width: 768px)') ) ) {
            desktop = true; gumshoe.setDistances();
        }
    });
});