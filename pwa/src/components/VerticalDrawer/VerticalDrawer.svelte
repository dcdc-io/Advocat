<script>
  import { fly } from "svelte/transition";
  import { quadIn } from "svelte/easing";
  import { Scrim } from "../../../node_modules/smelte/src/components/Util";
  import breakpoints from "../../../node_modules/smelte/src/breakpoints";
  import { ClassBuilder } from "../../../node_modules/smelte/src/utils/classes.js";

  const bp = breakpoints();

  const classesDefault = "fixed bottom-0 left-0 md:mt-16 w-full drawer overflow-hidden h-auto";
  const navClassesDefault = `h-full w-full bg-white dark:bg-gray-900 dark:text-gray-200 absolute flex w-auto z-20 drawer
    pointer-events-auto overflow-y-auto`;

  export let bottom = false;
  export let persistent = false;
  export let elevation = true;
  export let show = true;
  export let classes = classesDefault;
  export let navClasses = navClassesDefault;
  export let borderClasses = `border-gray-600 ${bottom ? "border-t" : "border-b"}`;

  let className = "";
  export {className as class};

  export let transitionProps = {
    duration: 200,
    y: -300,
    easing: quadIn,
    opacity: 1,
  };

  $: transitionProps.y = bottom ? 300 : -300;
  $: persistent = show = $bp !== "sm";

  const cb = new ClassBuilder(classes, classesDefault);

  if ($bp === 'sm') show = false;

  $: c = cb
    .flush()
    .add(classes, true, classesDefault)
    .add(borderClasses, !elevation && persistent)
    .add(className)
    .add("bottom-0", bottom)
    .add("top-0", !bottom)
    .add("pointer-events-none", persistent)
    .add("z-50", !persistent)
    .add("elevation-4", elevation)
    .add("z-20", persistent)
    .get();

  const ncb = new ClassBuilder(navClasses, navClassesDefault);

  $: n = ncb
    .flush()
    .get();

</script>

<style>
  .drawer {
    min-height: 50vh;
  }

  aside {
    width: 100vw;
  }
</style>
  
{#if show}
  <aside
    class={c}
    transition:fly={transitionProps}
  >
    {#if !persistent}
      <Scrim on:click={() => show = false} />
    {/if}
    <nav
      role="navigation"
      class={n}
    >
      <div class="w-full">
        <slot />
      </div>
    </nav>
  </aside>
{/if}