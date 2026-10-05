function hasAncestorElement(node, rootNode) {
  let parent = node.parentNode;
  while (parent && parent !== rootNode) {
    if (parent.tagName && parent.tagName.split(':').pop() === 'element') {
      return true;
    }
    parent = parent.parentNode;
  }
  return false;
}

export function parseXsdFields(xsdText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xsdText, 'application/xml');

  if (doc.querySelector('parsererror')) {
    throw new Error('Could not parse this file as XML/XSD.');
  }

  const allNodes = Array.from(doc.getElementsByTagName('*'));
  const root = doc.documentElement;

  const elementNodes = allNodes.filter((node) => {
    const localTag = node.tagName.split(':').pop();
    return localTag === 'element' && node.hasAttribute('name') && hasAncestorElement(node, root);
  });

  if (elementNodes.length === 0) {
    throw new Error('No nested <element> field definitions found in this XSD.');
  }

  return elementNodes.map((node) => ({
    name: node.getAttribute('name'),
    type: node.getAttribute('type') || 'unspecified',
    minOccurs: node.hasAttribute('minOccurs') ? Number(node.getAttribute('minOccurs')) : 1,
  }));
}