// https://esbuild.github.io/api/#hot-reloading-css
const hotReload = new EventSource('/esbuild');

hotReload.addEventListener('change', (event) => {
  const { added, removed, updated } = JSON.parse(event.data);

  if (added.length === 0 && removed.length === 0) {
    const links = document.getElementsByTagName('link');
    for (const link of links) {
      const url = new URL(link.href);

      for (const resource of updated) {
        if (url.host !== location.host) continue;
        if (url.pathname !== resource) continue;

        const next = link.cloneNode();
        next.href = resource + '?' + Math.random().toString(36).slice(2);
        next.onload = () => link.remove();
        link.parentNode?.insertBefore(next, link.nextSibling);
        return;
      }
    }
  }

  location.reload();
});
