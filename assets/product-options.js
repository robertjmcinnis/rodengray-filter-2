  // <![CDATA[  
var selectCallback = function(variant, selector) {
  if (variant && variant.available == true) {
    // selected a valid variant
    jQuery('.purchase').removeClass('disabled').removeAttr('disabled'); // remove unavailable class from add-to-cart button, and re-enable button
    jQuery('.price-field').html(Shopify.formatMoney(variant.price, "{{shop.money_with_currency_format}}"));  // update price field
  } else {
    // variant doesn't exist
    jQuery('.purchase').addClass('disabled').attr('disabled', 'disabled');      // set add-to-cart button to unavailable class and disable button
    var message = variant ? "Sold Out" : "Unavailable";    
    jQuery('.price-field').text(message); // update price-field message
  }
};

// initialize multi selector for product
jQuery(function() {
  new Shopify.OptionSelectors("product-select", { product: {{ product | json }}, onVariantSelected: selectCallback });
  jQuery('.selector-wrapper').addClass('clearfix');
  {% if product.options.size == 1 %}
  jQuery('.selector-wrapper').prepend("<label for='product-select-option-0'>{{ product.options.first }}</label>");
  {% endif %}
});
// ]]>