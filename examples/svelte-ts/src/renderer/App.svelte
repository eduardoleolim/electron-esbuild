<script lang="ts">
  let count: number = 0

  const increment = () => {
    count += 1
  }
</script>

<main>
  <h1>Hello, Svelte!</h1>

  <h3>Electron + Svelte + TypeScript</h3>
    <p>This is a sample app using Electron, Svelte, and TypeScript.</p>

    <button on:click={increment}>
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    font-size: 2em;
    font-family: Arial, sans-serif;
  }
</style>
