class TextTruncation {
  constructor(element, opts = {}) {
    const defaultOptions = {
      appendix: "…",
      className: null
    };

    this.options = Object.assign({}, defaultOptions, opts);
    this.element = element;
    this.originalHtml = this.element.innerHTML;
    this.containerEdge = TextTruncation.getContainerEdge(this.element);
    this.truncateElements = this.getTruncateElements(this.element);

    if (
      this.truncateElements[0].getBoundingClientRect().bottom >
      this.containerEdge
    ) {
      this.currentElementWidth = this.element.offsetWidth;
      this.truncateElement();
    }

    this.addWindowResizeListener();
  }

  static selectText(range, node, strEnd) {
    range.setStart(node, strEnd - 1);
    range.setEnd(node, strEnd);
  }

  static deleteNode(range, node) {
    range.selectNode(node);
    range.deleteContents();
  }

  static getContainerEdge(container) {
    return container.getBoundingClientRect().bottom;
  }

  static getTextNodesTree(elem) {
    return document.createTreeWalker(elem, NodeFilter.SHOW_TEXT, null, false);
  }

  static getElementNodesTree(elem) {
    return document.createTreeWalker(
      elem,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
  }

  static cleanUp(elem) {
    const elementNodes = TextTruncation.getElementNodesTree(elem);
    const elementNodesArr = [];
    let node;

    while ((node = elementNodes.nextNode())) {
      if (node.textContent.length === 0) {
        elementNodesArr.push(node);
      }
    }

    elementNodesArr.forEach(node => node.remove());
  }

  getTruncateElements(container) {
    let elements;

    if (this.options.className) {
      elements = container.querySelectorAll(`.${this.options.className}`);
    } else {
      elements = container.children;
    }

    return Array.from(elements).reverse();
  }

  addWindowResizeListener() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onWindowResize() {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      clearTimeout(this.resizeTimeout);

      const width = this.element.offsetWidth;

      if (width !== this.currentElementWidth) {
        if (width > this.currentElementWidth) {
          this.element.innerHTML = this.originalHtml;
          this.truncateElements = this.getTruncateElements(this.element);
        }

        this.containerEdge = TextTruncation.getContainerEdge(this.element);
        this.truncateElement();

        this.currentElementWidth = this.element.offsetWidth;
      }
    }, 100);
  }

  truncateElement() {
    (function iterate(elementsIndex) {
      const elem = this.truncateElements[elementsIndex];
      const { top, bottom } = elem.getBoundingClientRect();

      // if the top of the current element is beneath the container edge
      // remove the element because it is not visible anyway
      if (top > this.containerEdge) {
        elem.remove();
        this.truncateElements.shift();
        iterate.call(this, elementsIndex);
        // if the text goes below the container edge
      } else if (bottom > this.containerEdge) {
        const range = document.createRange();
        const textNodes = TextTruncation.getTextNodesTree(elem);
        const textNodesArr = [];
        let sliceLength; // in the end we will slice this amount of characters from the end of the string

        let textNode;
        while ((textNode = textNodes.nextNode())) {
          textNodesArr.push(textNode);
        }

        (function truncate(textNodeIndex) {
          const node = textNodesArr[textNodeIndex];
          const nodeLen = node.length;

          sliceLength = 0;

          TextTruncation.selectText(range, node, nodeLen);

          const rects = range.getClientRects();
          const rectsLength = rects.length;

          // use case: '<sup>foo</sup> <sup>foo</sup>'
          // this is needed for the whitespace between to html elements
          if (rectsLength === 0) {
            TextTruncation.deleteNode(range, node);

            if (textNodeIndex > 0) {
              truncate.call(this, textNodeIndex - 1);
            }
          } else if (rects[0] && this.containerEdge < rects[0].bottom) {
            let strEnd = nodeLen - sliceLength;

            while (
              (range.getClientRects().length &&
                range.getClientRects()[0].bottom > this.containerEdge &&
                range.endOffset > 0) ||
              (range.getClientRects().length === 0 && strEnd > 0)
            ) {
              strEnd = nodeLen - sliceLength;

              if (
                strEnd === 0 ||
                (strEnd === 1 && node.nodeValue.indexOf(" ") === 0) // there is a problem with strings that begin with a whitespace in FF.
              ) {
                TextTruncation.deleteNode(range, node);

                if (textNodeIndex > 0) {
                  truncate.call(this, textNodeIndex - 1);
                }
              } else {
                TextTruncation.selectText(range, node, strEnd);
                sliceLength++;
              }
            }
          }
        }.bind(this)(textNodesArr.length - 1));

        // text is short enough now or has no more characters

        const { nodeValue } = range.startContainer;

        // if there is text left in the current element
        // append the appendix
        if (nodeValue && nodeValue.length > sliceLength) {
          range.startContainer.nodeValue = `${nodeValue.slice(
            0,
            nodeValue.length - sliceLength - 3
          )}${this.options.appendix}`;
          // otherwise truncate the next element
        } else {
          iterate.call(this, elementsIndex + 1);
        }
      }

      TextTruncation.cleanUp(elem);
    }.bind(this)(0));
  }
}

export default TextTruncation;
