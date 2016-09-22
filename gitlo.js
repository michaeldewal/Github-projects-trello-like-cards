var cardClasses = ".issue-card h5 > a, .project-card h5 > a";
var urlBase = "https://github.com";

var cardModal = '<div class="modal" style="display: none"></div>';
var wasDoubleClicked = false;
var maxBranchNameLength = 50;

function getCardInformation(url) {
  var card = $('.modal');
  $.ajax(urlBase+ url).done(function(result){
    if(wasDoubleClicked) return false;
    card.empty();
    var content = $(result).find("[type='text/css'], #show_issue");
    card.html(content);
    appendBranchName();
    card.modal();
  });
}

function urlHasHash() {
  return (window.location.hash)?true:false;
}

function getUrlHash() {
  return window.location.hash;
}

function getTicketNumber() {
  return getUrlHash().replace('#', '');
}

function getBranchName() {
  if(urlHasHash())
    return '<p>g' + getTicketNumber() + '-' + $('.js-issue-title').text().trim().toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-').substr(0, maxBranchNameLength)+'</p>';
  else
    return false;
}

function appendBranchName() {
  var branchName = getBranchName();
  if(branchName !== false) {
    $(branchName).appendTo('.flex-table-item-primary');
  }
}

function triggerCard() {
  var withCardId = $("div[id='"+getTicketNumber()+"'] > h5 > a");
  var withTicketId = $("a[href$='"+getTicketNumber()+"']");

  if(withTicketId.length > 0 || withCardId.length > 0) {
    withCardId.trigger('click');
    withTicketId.trigger('click');
  } else {
    setTimeout(triggerCard, 100);
  }
}

function removeHash () {
  history.pushState("", document.title, window.location.pathname + window.location.search);
}

$(document).ready(function(){
  $(cardModal).appendTo('body');
  var body = $('body');
  body.on('click', cardClasses, function(event){
    event.preventDefault();
    var url = $(this).attr('href');
    var urlParts = url.split('/');
    var ticketId = urlParts[urlParts.length - 1];
    window.location.href = '#'+ticketId;
    getCardInformation(url);
  });
  body.on('dblclick', cardClasses, function(event){
    wasDoubleClicked = true;
    event.preventDefault();
    window.location.href = $(this).attr('href');
  });

  body.on('click', '.close-modal', function(){
    removeHash();
  });
  if(urlHasHash()) {
    triggerCard();
  }
});