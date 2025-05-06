jQuery(function () {
  var $liveUpdate;
  var $treeNodes;
  var $treeNodesMaxDeth;
  var $treeNodesOptions;
  var $updateButton;
  var liveUpdateMode;
  var updateNodes;

  updateNodes = function (treeNodes) {
    var serializedTree;
    serializedTree = treeNodes.nestable('serialize');
    return $.ajax({
      url: treeNodes.data('update-path'),
      type: 'POST',
      data: {
        treeNodes: serializedTree
      },
      success: function (data) {
        var $flash;
        $flash = $('<div>')
          .addClass('nestable-flash alert alert-success')
          .append($('<button>')
          .addClass('close')
          .data('dismiss', 'alert')
          .html('&times;'))
          .append($('<span>')
          .addClass('body')
          .html(data));

        $('#rails_admin_nestable').append($flash);
        return $flash.fadeIn(200).delay(2000).fadeOut(200, function () {
          return $(this).remove();
        });
      }
    });
  };
  $treeNodes = $('#tree_nodes');
  $treeNodesOptions = {};
  $treeNodesMaxDeth = $treeNodes.data('max-depth');
  $liveUpdate = $('#rails_admin_nestable input[type=checkbox]');
  $updateButton = $('#rails_admin_nestable button');
  liveUpdateMode = (!$liveUpdate.length && !$updateButton.length) ? true : $liveUpdate.prop('checked');
  $('#rails_admin_nestable button').prop('disabled', $liveUpdate.prop('checked'));
  $liveUpdate.change(function () {
    liveUpdateMode = $(this).prop('checked');
    return $updateButton.prop('disabled', liveUpdateMode);
  });
  $updateButton.click(function () {
    return updateNodes($treeNodes);
  });
  if ($treeNodesMaxDeth && $treeNodesMaxDeth !== 'false') {
    $treeNodesOptions['maxDepth'] = $treeNodesMaxDeth;
  }
  return $treeNodes.nestable($treeNodesOptions).on({
    change: function (event) {
      if (liveUpdateMode) {
        return updateNodes($treeNodes);
      }
    }
  });
});
