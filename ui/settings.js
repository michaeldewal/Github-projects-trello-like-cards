var settings = [
  'gitlo.suggest-label-branch-type-active',
  'gitlo.suggested-labels',
  'gitlo.hub-command-active',
  'gitlo.hub-command-default-branch',
  'gitlo.max-branch-name-length'
];

var settingsObject = {
  'gitlo.suggest-label-branch-type-active': true,
  'gitlo.suggested-labels': [
    {
      "orig": "feature",
      "sugg": "feature"
    },
    {
      "orig": "bug",
      "sugg": "fix"
    },
    {
      "orig": "chore",
      "sugg": "chore"
    },
    {
      "orig": "hotfix",
      "sugg": "hotfix"
    }
  ],
  'gitlo.hub-command-active': true,
  'gitlo.hub-command-default-branch': 'develop',
  'gitlo.max-branch-name-length': 50
};

chrome.storage.sync.get(settings, function(items){
  $.each(items, function(key, value){
    if(typeof value !== 'undefined') {
      if(key == 'gitlo.suggested-labels'){
        settingsObject[key] = jQuery.parseJSON(value);
      } else {
        settingsObject[key] = value;
      }
    }
  });

  if (chrome.runtime.error) {
    console.log("Runtime error.");
  }
});


// Add labels to document
var suggLabelsCount = 0;
function createLabelOutput() {
  var labelOutput = '';
  settingsObject['gitlo.suggested-labels'].forEach(function(label, key){
    labelOutput += '<p><input type="text" data-id="'+key+'" id="orig_'+key+'" value="'+label.orig+'">:<input type="text" data-id="'+key+'" id="sugg_'+key+'" value="'+label.sugg+'"></p>';
  suggLabelsCount++;
  });
  return labelOutput;
}

function addNewLabelSuggestion() {
  suggLabelsCount++;
  return '<p>' +
    '<input type="text" data-id="'+suggLabelsCount+'" id="orig_'+suggLabelsCount+'">:' +
    '<input type="text" data-id="'+suggLabelsCount+'" id="suggest_'+suggLabelsCount+'"></p>';
}

function setCheckBoxValue(checkbox, value) {
  checkbox.attr("checked", value)
}

function getLabelsArray() {
  var labelArray = [];
  $('#labelsList').find('input[id^="orig_"]').each(function(){
    var obj = {};
    var suggItem = $('#sugg_'+$(this).attr("data-id"));
    var origValue = $(this).val();
    if(origValue != "") {
      obj.sugg = suggItem.val();
      obj.orig = origValue;
      labelArray.push(obj);
    }
  });
  return labelArray;
}

$(document).ready(function(){
  var activateLabelSuggestions = $('#activateLabelSuggestions');
  var activateGitHub = $('#gitHubCommandActive');
  var branchNameLength = $('#maximumBranchLength');
  var hubCommand = $('#hubCommand');

  // Check for label suggest checkbox value change
  activateLabelSuggestions.on('change', function(event) {
    chrome.storage.sync.set({'gitlo.suggest-label-branch-type-active': $(this).is(":checked")}, function() {
      $('#labels').toggle();
    });
  });

  // Check for git hub command active
  activateGitHub.on('change', function(event) {
    chrome.storage.sync.set({'gitlo.hub-command-active': $(this).is(":checked")}, function() {
      $('#hubCommand').toggle();
    });
  });

  // Label for branch default checkbox
  if(settingsObject['gitlo.suggest-label-branch-type-active']) {
    setCheckBoxValue(activateLabelSuggestions, true);
  }

  // set git hub active checkbox
  if(settingsObject['gitlo.hub-command-active']) {
    setCheckBoxValue(activateGitHub, true);
  }

  // Set default label inputs
  var labels = $('#labelsList');
  $(createLabelOutput()).appendTo(labels);

  // Set maximum length branch name
  branchNameLength.val(settingsObject['gitlo.max-branch-name-length']);
  $('#defaultBranch').val(settingsObject['gitlo.hub-command-default-branch']);

  // Click add new label
  $('#addNewSuggestion').click(function(){
    $(addNewLabelSuggestion()).appendTo(labels);
  });

  // Click save options
  $('#saveOptions').click(function(){
    // Set branch name length
    chrome.storage.sync.set({
      'gitlo.max-branch-name-length': branchNameLength.val(),
      'gitlo.suggest-label-branch-type-active': $('#activateLabelSuggestions').is(":checked"),
      'gitlo.hub-command-active': $('#gitHubCommandActive').is(":checked"),
      'gitlo.suggested-labels': JSON.stringify(getLabelsArray()),
      'gitlo.hub-command-default-branch': $('#defaultBranch').val()
    });
  });

  // Click reset
  $('#resetSettings').click(function(){
    chrome.storage.sync.remove('gitlo.suggest-label-branch-type-active');
    chrome.storage.sync.remove('gitlo.suggested-labels');
    chrome.storage.sync.remove('gitlo.hub-command-active');
    chrome.storage.sync.remove('gitlo.max-branch-name-length');
    chrome.storage.sync.remove('gitlo.hub-command-default-branch');
  });
});