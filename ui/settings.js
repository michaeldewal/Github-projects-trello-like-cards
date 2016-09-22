// set initial settings
var prefix = "gitlo-";

// suggest branch name on labels
var isSuggestLabelBranchTypeActive = localStorage.getItem(prefix + 'suggest-label-branch-type-active');
if(isSuggestLabelBranchTypeActive === null) {
  var defaultSuggestLabelActive = true;
  localStorage.setItem(prefix + 'suggest-label-branch-type-active', defaultSuggestLabelActive);
  isSuggestLabelBranchTypeActive = defaultSuggestLabelActive;
}

// labels to convert
var suggestedLabels = localStorage.getItem(prefix + 'suggested-labels');
if(suggestedLabels === null || suggestedLabels === 'undefined') {
  var defaultSuggestedLabels = [
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
  ];
  localStorage.setItem(prefix + 'suggested-labels', JSON.stringify(defaultSuggestedLabels));
  suggestedLabels = defaultSuggestedLabels;
} else {
  suggestedLabels = JSON.parse(suggestedLabels);
}

// Add git hub command for using issue as PR active
var isHubCommandActive = localStorage.getItem(prefix + 'hub-command-active');
if(isHubCommandActive === null) {
  var defaultIsHubCommandActive = true;
  localStorage.setItem(prefix + 'hub-command-active', defaultIsHubCommandActive);
  isHubCommandActive = defaultIsHubCommandActive;
}

// Add git hub command for using issue as PR active
var hubCommentBranch = localStorage.getItem(prefix + 'hub-command-default-branch');
if(hubCommentBranch === null) {
  var hubCommandDefaultBranch = 'develop';
  localStorage.setItem(prefix + 'hub-command-default-branch', hubCommandDefaultBranch);
  hubCommentBranch = hubCommandDefaultBranch;
}

var maxBranchNameLength = localStorage.getItem(prefix + 'max-branch-name-length');
if(maxBranchNameLength === null) {
  var defaultMaxBranchNameLength = 50;
  localStorage.setItem(prefix + 'max-branch-name-length', defaultMaxBranchNameLength);
  maxBranchNameLength = defaultMaxBranchNameLength;
}

// Add labels to document
var suggLabelsCount = 0;
function createLabelOutput() {
  var labelOutput = '';
  suggestedLabels.forEach(function(label, key){
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
    localStorage.setItem(prefix + 'suggest-label-branch-type-active', $(this).is(":checked"));
    $('#labels').toggle();
  });

  // Check for git hub command active
  activateGitHub.on('change', function(event) {
    localStorage.setItem(prefix + 'hub-command-active', $(this).is(":checked"));
    $('#hubCommand').toggle();
  });

  // Label for branch default checkbox
  if(isSuggestLabelBranchTypeActive) {
    setCheckBoxValue(activateLabelSuggestions, true);
  }

  // set git hub active checkbox
  if(isHubCommandActive) {
    setCheckBoxValue(activateGitHub, true);
  }

  // Set default label inputs
  var labels = $('#labelsList');
  $(createLabelOutput()).appendTo(labels);

  // Set maximum length branch name
  branchNameLength.val(maxBranchNameLength);
  $('#defaultBranch').val(localStorage.getItem(prefix + 'hub-command-default-branch'));

  // Click add new label
  $('#addNewSuggestion').click(function(){
    $(addNewLabelSuggestion()).appendTo(labels);
  });

  // Click save options
  $('#saveOptions').click(function(){
    // Set branch name length
    localStorage.setItem(prefix + 'max-branch-name-length', branchNameLength.val());

    // label suggestions active
    localStorage.setItem(prefix + 'suggest-label-branch-type-active', $('#activateLabelSuggestions').is(":checked"));

    // save hub options
    localStorage.setItem(prefix + 'hub-command-active', $('#gitHubCommandActive').is(":checked"));

    // Saving labels
    localStorage.setItem(prefix + 'suggested-labels', JSON.stringify(getLabelsArray()));

    localStorage.setItem(prefix + 'hub-command-default-branch', $('#defaultBranch').val());
  });

  // Click reset
  $('#resetSettings').click(function(){
    localStorage.removeItem(prefix + 'suggest-label-branch-type-active');
    localStorage.removeItem(prefix + 'suggested-labels');
    localStorage.removeItem(prefix + 'hub-command-active');
    localStorage.removeItem(prefix + 'max-branch-name-length');
    localStorage.removeItem(prefix + 'hub-command-default-branch');
  });
});