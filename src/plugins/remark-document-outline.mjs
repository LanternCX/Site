export default function remarkDocumentOutline() {
	return (tree) => {
		for (const child of tree.children) {
			if (child.type === 'heading' && child.depth === 1) child.depth = 2;
		}
	};
}
