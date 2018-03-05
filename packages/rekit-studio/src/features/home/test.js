const util = require('./util');

function scrollIntoView(elem, container, config) {
  config = config || {};
  // document 归一化到 window
  if (container.nodeType === 9) {
    container = util.getWindow(container);
  }

  let allowHorizontalScroll = config.allowHorizontalScroll;
  const onlyScrollIfNeeded = config.onlyScrollIfNeeded;
  let alignWithTop = config.alignWithTop;
  let alignWithLeft = config.alignWithLeft;
  const offsetTop = config.offsetTop || 0;
  const offsetLeft = config.offsetLeft || 0;
  const offsetBottom = config.offsetBottom || 0;
  const offsetRight = config.offsetRight || 0;

  allowHorizontalScroll = allowHorizontalScroll === undefined ? true : allowHorizontalScroll;

  const isWin = util.isWindow(container);
  const elemOffset = util.offset(elem);
  const eh = util.outerHeight(elem);
  const ew = util.outerWidth(elem);
  let containerOffset;
  let ch;
  let cw;
  let containerScroll;
  let diffTop;
  let diffBottom;
  let win;
  let winScroll;
  let ww;
  let wh;

  if (isWin) {
    win = container;
    wh = util.height(win);
    ww = util.width(win);
    winScroll = {
      left: util.scrollLeft(win),
      top: util.scrollTop(win),
    };
    // elem 相对 container 可视视窗的距离
    diffTop = {
      left: elemOffset.left - winScroll.left - offsetLeft,
      top: elemOffset.top - winScroll.top - offsetTop,
    };
    diffBottom = {
      left: elemOffset.left + ew - (winScroll.left + ww) + offsetRight,
      top: elemOffset.top + eh - (winScroll.top + wh) + offsetBottom,
    };
    containerScroll = winScroll;
  } else {
    containerOffset = util.offset(container);
    ch = container.clientHeight;
    cw = container.clientWidth;
    containerScroll = {
      left: container.scrollLeft,
      top: container.scrollTop,
    };
    // elem 相对 container 可视视窗的距离
    // 注意边框, offset 是边框到根节点
    diffTop = {
      left:
        elemOffset.left -
        (containerOffset.left + (parseFloat(util.css(container, 'borderLeftWidth')) || 0)) -
        offsetLeft,
      top:
        elemOffset.top - (containerOffset.top + (parseFloat(util.css(container, 'borderTopWidth')) || 0)) - offsetTop,
    };
    diffBottom = {
      left:
        elemOffset.left +
        ew -
        (containerOffset.left + cw + (parseFloat(util.css(container, 'borderRightWidth')) || 0)) +
        offsetRight,
      top:
        elemOffset.top +
        eh -
        (containerOffset.top + ch + (parseFloat(util.css(container, 'borderBottomWidth')) || 0)) +
        offsetBottom,
    };
  }

  if (diffTop.top < 0 || diffBottom.top > 0) {
    // 强制向上
    if (alignWithTop === true) {
      util.scrollTop(container, containerScroll.top + diffTop.top);
    } else if (alignWithTop === false) {
      util.scrollTop(container, containerScroll.top + diffBottom.top);
    } else {
      // 自动调整
      if (diffTop.top < 0) {
        util.scrollTop(container, containerScroll.top + diffTop.top);
      } else {
        util.scrollTop(container, containerScroll.top + diffBottom.top);
      }
    }
  } else {
    if (!onlyScrollIfNeeded) {
      alignWithTop = alignWithTop === undefined ? true : !!alignWithTop;
      if (alignWithTop) {
        util.scrollTop(container, containerScroll.top + diffTop.top);
      } else {
        util.scrollTop(container, containerScroll.top + diffBottom.top);
      }
    }
  }

  if (allowHorizontalScroll) {
    if (diffTop.left < 0 || diffBottom.left > 0) {
      // 强制向上
      if (alignWithLeft === true) {
        util.scrollLeft(container, containerScroll.left + diffTop.left);
      } else if (alignWithLeft === false) {
        util.scrollLeft(container, containerScroll.left + diffBottom.left);
      } else {
        // 自动调整
        if (diffTop.left < 0) {
          util.scrollLeft(container, containerScroll.left + diffTop.left);
        } else {
          util.scrollLeft(container, containerScroll.left + diffBottom.left);
        }
      }
    } else {
      if (!onlyScrollIfNeeded) {
        alignWithLeft = alignWithLeft === undefined ? true : !!alignWithLeft;
        if (alignWithLeft) {
          util.scrollLeft(container, containerScroll.left + diffTop.left);
        } else {
          util.scrollLeft(container, containerScroll.left + diffBottom.left);
        }
      }
    }
  }
}

module.exports = scrollIntoView;
