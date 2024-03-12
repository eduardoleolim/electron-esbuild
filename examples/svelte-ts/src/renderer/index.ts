import App from './App.svelte';

const appElement = document.getElementById('app');

if (appElement) {
  const app = new App({
    target: appElement,
  });
} else {
  console.error('No app element found');
}
