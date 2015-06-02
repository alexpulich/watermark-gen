$.fn.tooltip = function(options) {
  var $this, body, bottomEdge, createdTooltip, elemHeight, elemWidth, leftCentered, leftEdge, markup, positions, rightEdge, tooltipHeight, tooltipWidth, topCentered, topEdge;
  options = {
    position: options.position || 'right',
    content: options.content || 'i am tooltip'
  };
  $this = $(this);
  body = $('body');
  elemWidth = $this.outerWidth(true);
  elemHeight = $this.outerHeight(true);
  topEdge = $this.offset().top;
  bottomEdge = topEdge + elemHeight;
  leftEdge = $this.offset().left;
  rightEdge = leftEdge + elemWidth;
  markup = "<div class='tooltip tooltip_" + options.position + "' data-tooltip='" + ($this.attr("id") || "") + "'> <div class='tooltip__inner'>" + options.content + "</div> </div>";
  body.append(markup).end().find('.tooltip');
  createdTooltip = body.find('.tooltip').last();
  tooltipHeight = createdTooltip.outerHeight(true);
  tooltipWidth = createdTooltip.outerWidth(true);
  leftCentered = (elemWidth / 2) - (tooltipWidth / 2);
  topCentered = (elemHeight / 2) - (tooltipHeight / 2);
  switch (options.position) {
    case 'right':
      positions = {
        left: rightEdge,
        top: topEdge
      };
      break;
    case 'top':
      positions = {
        left: leftEdge + leftCentered,
        top: topEdge - tooltipHeight
      };
      break;
    case 'bottom':
      positions = {
        left: leftEdge + leftCentered,
        top: bottomEdge
      };
      break;
    case 'left':
      positions = {
        left: leftEdge - tooltipWidth,
        top: topEdge + topCentered
      };
      break;
    default:
      positions = {
        left: leftEdge - tooltipWidth,
        top: topEdge + topCentered
      };
      break;
  }
  return createdTooltip.offset(positions).css('opacity', '1');
};
